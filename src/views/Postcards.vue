<template>
  <div>
    <div class='wraper-inner'>
      <section class='main-new-section'>
        <img src='@/assets/images/main-banner-images.png'>
        <div class='container'>
          <div class='main-header-blk' style='z-index:1000;'>
            <div class='main-header-logo'>
              <img src='postcardwtf.gif' width='150' height='150'>
            </div>
            <div class='main-header-content'>
              <h6>This Dapp lets you send notes to the wallets of your friends as a NFT! It can be used to send thank
                you notes, holiday greetings, on chain messaging service, pranks and anything else you can think up! You
                can use emoticons! ❤️ [V 1.0]</h6>
            </div>
            <div class='main-header-actions'>
              <v-btn
              block
              class='btn wallet-select-btn'
              @click="$store.commit('app/setWalletDialog', true)"
              >
                <span v-if="!connected">
                  Select Wallet
                </span>
                <span
                  v-else
                  style="text-transform: none;"
                >
                {{ address | address(6) }}
              </span>
            </v-btn>
            </div>
          </div>
          <div class='main-middle-block'>
            <div class='row'>
              <div class='col-md-6'>
                <div class='color-picker-block'>
                  <div class='form-group'>
                    <label>Background Color</label>
                    <div class='color-picker'>
                      <div id='first' v-for="color in colors" :key="color" :style="{backgroundColor: color}" class='bg-color' :class="{'selected': selectedBgColor === color}" @click='selectedBgColor = color'></div>
                    </div>
                  </div>
                  <div class='form-group'>
                    <label>Foreground Color</label>
                    <div class='color-picker'>
                      <div id='first' v-for="color in colors" :key="color" :style="{backgroundColor: color}" class='txt-color' :class="{'selected': selectedTextColor === color}" @click='selectedTextColor = color'></div>
                    </div>
                  </div>
                  <div class='form-group'>
                    <label>Write Your PostCard</label>
                    <textarea class='card-content' v-model="text" maxlength='144' rows='4'
                      placeholder='Write text here...'></textarea>
                  </div>
                  <span class='download-btn' @click='downloadim()'>
                    <!-- <i class='ri-download-cloud-2-line'></i> -->
                    <i class='bi bi-download' style='font-size: 2rem;'></i>
                  </span>
                </div>
              </div>
              <div class='col-md-6'>
                <div class='card-preview-block'>
                  <div class='card-canvas-blk' id='canvas' :style="{backgroundColor: selectedBgColor}">

                    <p id='canvasText' :style="{color: selectedTextColor}">{{text}}</p>
                  </div>
                  <div class='form-group'>
                    <label>Receiver Address</label>
                    <input type='text' class='form-control' placeholder='Enter address here...' v-model="send_to">
                  </div>
                  <div class='form-btn-blk'>
                    <n-f-t-creator-costs :file-size="fileSize || 0" />
                    <a v-if="connected" class='btn mint-btn' @click="create">MINT</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='main-footer-blk'>
            <div class='row'>
              <div class='col-md-6'>
                <div class='footer-team-block'>
                  <ul>
                    <li>
                      TEAM
                      <a href='https://twitter.com/kazumidapp' target='_blank'>
                        <figure>
                          <img src='@/assets/images/team-1.jpg'>
                        </figure>
                        <h6>@kazumidapp</h6>
                      </a>
                    </li>
                    <li>
                      <a href='https://twitter.com/robb747' target='_blank'>
                        <figure>
                          <img src='@/assets/images/team-2.png'>
                        </figure>
                        <h6>@robb747</h6>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class='col-md-6'>
                <div class='footer-content-blk'>
                  <h6 class='good-project'>Funds from this Dapp go to<span class='rainbow rainbow_text_animated'> Kazumi's Good Project DAO</span> to help fund new cool stuff like this!
                      <br>
                      <br>
                    <h6 class='rainbow rainbow_text_animated_slow'>https://goodproject.baby</h6>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { PublicKey } from '@solana/web3.js';
import mintNFT from '../utils/mintNFT';
import transferNFT from '../utils/transferNFT';
import NFTCreatorCosts from '../components/NFTCreatorCosts.vue';
import { Creator, extendBorsh } from '../utils/metaplex/metadata';

export default {
  components: { NFTCreatorCosts },
  data() {
    return {
      colors: ['#EB4D4B', '#4834D4', '#F9CA24', '#6AB04C', '#95AFC0', '#FFFFFF'],
      selectedBgColor: '#EB4D4B',
      selectedTextColor: '#FFFFFF',
      text: '',
      image: null,
      send_to: '',
    };
  },
  async mounted() {
    const canvas = await html2canvas(document.getElementById('canvas'), { removeContainer: true });
    this.image = await this.dataURLtoFile(canvas.toDataURL('image/png'), 'image.png');
  },
  methods: {
    downloadim() {
      const img = document.createElement('a');
      html2canvas(document.getElementById('canvas'), { removeContainer: true }).then((canvas) => {
        const myImage = canvas.toDataURL('image/png');
        img.download = 'postcard.png';
        img.href = myImage;
        img.click();
      });
    },
    async create() {
      const canvas = await html2canvas(document.getElementById('canvas'), { removeContainer: true });
      this.image = await this.dataURLtoFile(canvas.toDataURL('image/png'), 'image.png');

      console.log('minting', this.image);
      extendBorsh();
      const metadata = {
        animation_url: undefined,
        creators: [
          new Creator({
            // Page owner's cut
            address: new PublicKey('FKB4pppWZVKE2HypsZVjaY237rrXJEkATd626PTj2JMa'),
            verified: false,
            share: 1,
          }),
          new Creator({
            // Minter's cut
            address: new PublicKey(this.$wallet.publicKey.toString()),
            verified: true,
            share: 99,
          }),
        ],
        description: 'POSTCARD WTF',
        external_url: 'https://www.postcards.wtf',
        image: this.image.name,
        name: 'Postcard',
        symbol: '',
        // Royalties
        sellerFeeBasisPoints: 15,
        attributes: [
          {
            trait_type: 'Text',
            value: this.text,
          },
          {
            trait_type: 'Background Color',
            value: this.selectedBgColor,
          },
          {
            trait_type: 'Text Color',
            value: this.selectedTextColor,
          },
        ],
        collection: null,
        properties: {
          category: 'image',
          files: [{ type: this.image.type, uri: this.image.name }],
        },
      };
      try {
        const result = await mintNFT(this.$connection, this.$wallet, [this.image], metadata, this.send_to);
      } catch (error) {
        console.error(error);
      }
    },
    async dataURLtoFile(dataUrl, fileName) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], fileName, { type: 'image/png' });
    },
  },
  watch: {
    file: {
      handler: async function () {
        const canvas = await html2canvas(document.getElementById('canvas'), { removeContainer: true });
        this.image = await this.dataURLtoFile(canvas.toDataURL('image/png'), 'image.png');
      },
    },
  },
  computed: {
    file() {
      return `${this.selectedTextColor}|${this.selectedBgColor}|${this.text}`;
    },
    connected: {
      get() {
        return this.$store.state.wallet.connected;
      },
    },
    address: {
      get() {
        return this.$store.state.wallet.address;
      },
    },
    fileSize() {
      if (!this.image || !this.image.size) return null;
      return this.image.size;
    },
  },
};
</script>

<style>
body,
td,
th {
  font-family: 'Lucida Console', Monaco, monospace;
  color: #ffffff;
}
.card-content{
  background-color: white;
}
a:link {
  color: #ffffff;
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
a:hover {
  color: #ffffff;
  text-decoration: underline;
}
a:active {
  text-decoration: none;
}
.rainbow {
  text-align: center;
  letter-spacing: 5px;
}
.rainbow_text_animated {
  background: linear-gradient(
    to right,
    #6666ff,
    #0099ff,
    #00ff00,
    #ff3399,
    #6666ff
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow_animation 0.1s ease-in-out infinite;
  background-size: 400% 100%;
}

.rainbow_text_animated_slow {
  background: linear-gradient(
    to right,
    #6666ff,
    #0099ff,
    #00ff00,
    #ff3399,
    #6666ff
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow_animation 6s ease-in-out infinite;
  background-size: 400% 100%;
}

@keyframes rainbow_animation {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}
.wallet-select-btn {
    background: #fe2667 !important;
    font-size: 16px !important;
    color: #fff !important;
    font-weight: 700 !important;
    height: 42px !important;
    line-height: 42px !important;
    padding: 0 20px !important;
}
</style>
