<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">
        <img src="@/assets/en_logo.jpg" width="30" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <img :src="avatar" width="30" /><em>{{ givenName }}</em>
            </template>
            <b-dropdown-item href="#" id="signout-button" @click.prevent="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- <b-container class="table-row"> -->
    <b-row class="text-center tableRow">
      <b-col></b-col>
      <b-col cols="10">
        <b-card no-body class="coin-market-cap_card">
          <b-tabs pills card>
            <b-tab title="Show All" active lazy>
              <b-card-text>
                <b-table
                  sticky-header
                  :items="allTableItems"
                  :fields="allTableFields"
                  head-variant="light"
                  thead-class="tableHeadClass"
                >
                  <template v-slot:cell(percent_change_1h)="row">
                    <span
                      :class="row.item.quote.USD.percent_change_1h>=0?'text-success':'text-danger'"
                    >{{row.item.quote.USD.percent_change_1h}}%</span>
                  </template>

                  <template v-slot:cell(percent_change_24h)="row">
                    <span
                      :class="row.item.quote.USD.percent_change_24h>=0?'text-success':'text-danger'"
                    >{{row.item.quote.USD.percent_change_24h}}%</span>
                  </template>

                  <template v-slot:cell(percent_change_7d)="row">
                    <span
                      :class="row.item.quote.USD.percent_change_7d>=0?'text-success':'text-danger'"
                    >{{row.item.quote.USD.percent_change_7d}}%</span>
                  </template>

                  <template v-slot:cell(action)="row">
                    <b-form-checkbox
                      v-model="portfolioAdded[row.item.id]"
                      @change="addPortfolio(row.item, portfolioAdded[row.item.id])"
                      switch
                    ></b-form-checkbox>
                  </template>
                </b-table>
              </b-card-text>
            </b-tab>
            <b-tab title="My Portfolio" lazy>
              <b-card-text>
                <b-row class="my-1">
                  <b-col sm="6"></b-col>
                  <b-col sm="3" class="text-right">
                    <label for="totalAmount">PORTFOLIO TOTAL:</label>
                  </b-col>
                  <b-col sm="3">
                    <b-form-input
                      id="totalAmount"
                      v-model="totalPortfolioValue"
                      class="totalAmountInput"
                      readonly
                    ></b-form-input>
                  </b-col>
                </b-row>
                <b-table
                  sticky-header
                  :items="portfolioData"
                  :fields="portTableFields"
                  head-variant="light"
                  thead-class="tableHeadClass"
                >
                  <template v-slot:cell(percent_change_1h)="row">
                    <span
                      :class="row.item.quote.USD.percent_change_1h>=0?'text-success':'text-danger'"
                    >{{row.item.quote.USD.percent_change_1h}}%</span>
                  </template>

                  <template v-slot:cell(percent_change_24h)="row">
                    <span
                      :class="row.item.quote.USD.percent_change_24h>=0?'text-success':'text-danger'"
                    >{{row.item.quote.USD.percent_change_24h}}%</span>
                  </template>

                  <template v-slot:cell(amount)="row">
                    <input
                      v-model="row.item.amount"
                      type="text"
                      class="form-control holdingAmountInput"
                      @change="changeHoldingAmount(row.item.amount, row.item.id)"
                    />
                  </template>

                  <template v-slot:cell(holdingValue)="row">
                    <span>$ {{numberWithCommas((row.item.amount * row.item.quote.USD.price).toFixed(8))}}</span>
                  </template>
                </b-table>
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
    <!-- </b-container> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { userSession } from '../userSession'
import axios from '../net/axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

export default {
  methods: {
    signOut () {
      userSession.signUserOut(window.location.href)
    },
    getCoinMarketCapData: function () {
      axios.getCoinMarketCapData().then(res => {
        this.allTableItems = res.data.data
      })
    },
    addPortfolio: async function (item, checked) {
      let options = { encrypt: true }

      if (!checked) {
        let newEntry = { ...item, amount: 0 }
        this.portfolioData.unshift(newEntry)
      } else {
        this.portfolioData = this.portfolioData.filter(eachItem => {
          return eachItem.id !== item.id
        })

        this.totalPortfolioValue = 0
        for (var i = 0; i < this.portfolioData.length; i++) {
          this.totalPortfolioValue +=
            this.portfolioData[i].quote.USD.price *
            this.portfolioData[i].amount
        }
        this.totalPortfolioValue = this.numberWithCommas(this.totalPortfolioValue)
      }
      await userSession.putFile(
        'portfolio.json',
        JSON.stringify(this.portfolioData),
        options
      )
    },
    changeHoldingAmount: async function (value, id) {
      let options = { encrypt: true }

      this.portfolioData.forEach(eachPortfolio => {
        if (eachPortfolio.id === id) {
          eachPortfolio.amount = value
        }
      })

      this.totalPortfolioValue = 0
      for (var i = 0; i < this.portfolioData.length; i++) {
        this.totalPortfolioValue +=
          this.portfolioData[i].quote.USD.price * this.portfolioData[i].amount
      }
      this.totalPortfolioValue = this.numberWithCommas(this.totalPortfolioValue)

      await userSession.putFile(
        'portfolio.json',
        JSON.stringify(this.portfolioData),
        options
      )
    },
    numberWithCommas (num) {
      if (num) {
        num = parseFloat(num)
        num = num.toFixed(8)
        var numParts = num.toString().split('.')
        numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return numParts.join('.')
      } else {
        return num
      }
    }
  },
  data () {
    return {
      blockstack: window.blockstack,
      avatar: 'https://s3.amazonaws.com/onename/avatar-placeholder.png',
      givenName: 'Anonymous',
      allTableFields: [
        {
          label: '#',
          key: 'id',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData'
        },
        {
          label: 'Name',
          key: 'name',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${item.name} (${item.symbol})`
          }
        },
        {
          label: 'Price(USD)',
          key: 'quote.USD.price',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `$${this.numberWithCommas(value)}`
          }
        },
        {
          label: 'Volume(24hr)',
          key: 'quote.USD.volume_24h',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `$${this.numberWithCommas(value)}`
          }
        },
        {
          label: '% Change(1h)',
          key: 'percent_change_1h',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${value}%`
          }
        },
        {
          label: '% Change(1d)',
          key: 'percent_change_24h',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${value}%`
          }
        },
        {
          label: '% Change(1w)',
          key: 'percent_change_7d',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${value}%`
          }
        },
        {
          label: 'Add Portfolio',
          key: 'action',
          align: 'center',
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData'
        }
      ],
      portTableFields: [
        {
          label: '#',
          key: 'id',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData'
        },
        {
          label: 'Name',
          key: 'name',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${item.name} (${item.symbol})`
          }
        },
        {
          label: 'Price(USD)',
          key: 'quote.USD.price',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `$${this.numberWithCommas(value)}`
          }
        },
        {
          label: '% Change(1h)',
          key: 'percent_change_1h',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${value}%`
          }
        },
        {
          label: '% Change(1d)',
          key: 'percent_change_24h',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${value}%`
          }
        },
        {
          label: 'Holding Amount',
          key: 'amount',
          sortable: true,
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData',
          formatter: (value, key, item) => {
            return `${this.numberWithCommas(value)}`
          }
        },
        {
          label: 'Holding Value',
          key: 'holdingValue',
          sortable: true,
          align: 'center',
          class: 'text-center',
          thClass: 'tableHeader',
          tdClass: 'tableData'
        }
      ],
      allTableItems: [],
      portfolioData: [],
      portfolioAdded: [],
      totalPortfolioValue: 0
    }
  },
  mounted () {
    const blockstack = this.blockstack
    if (blockstack.isUserSignedIn()) {
      const profile = blockstack.loadUserData().profile
      const user = new blockstack.Person(profile)
      this.givenName = user.name() ? user.name() : 'Nameless Person'
      if (user.avatarUrl()) this.avatar = user.avatarUrl()
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(userData => {
        window.location = window.location.origin
      })
    }
  },
  async created () {
    await this.getCoinMarketCapData()
    let options = { decrypt: true }

    this.allTableItems.forEach(each => {
      this.portfolioAdded[each.id] = false
    })

    let portfolioDataFromGaia = await userSession.getFile(
      'portfolio.json',
      options
    )
    if (portfolioDataFromGaia) {
      this.portfolioData = JSON.parse(portfolioDataFromGaia)
      if (this.portfolioData.length > 0) {
        this.portfolioData.forEach(each => {
          this.portfolioAdded[each.id] = true
        })
      }

      this.totalPortfolioValue = 0
      for (var i = 0; i < this.portfolioData.length; i++) {
        this.totalPortfolioValue +=
          this.portfolioData[i].quote.USD.price * this.portfolioData[i].amount
      }
      this.totalPortfolioValue = this.numberWithCommas(this.totalPortfolioValue)
    } else {
      this.portfolioData = []
    }
  }
}
</script>

<style lang="scss">
.table-row {
  margin-top: 10px;
}

.nav-pills .nav-link {
  border-radius: 0rem !important;
}

.coin-market-cap_card a {
  color: white;
  text-decoration: none;
  background-color: gray;
}

.tableHeadClass {
  background: darkblue;
}

.tableRow {
  font-size: 0.75em;
}

.holdingAmountInput {
  height: 10px;
  width: 80px;
  font-size: 10px;
  margin-left: auto;
  margin-right: auto;
}

.totalAmountInput {
  height: 10px;
  font-size: 10px;
}
</style>
