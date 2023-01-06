<template>
  <div :dummy="transactionsTrigger">
    <transactions-table
      :loading="loading"
      :category-summaries="categorySummaries"
      :query-start-date-moment="queryStartDateMoment"
      :query-end-date-moment="queryEndDateMoment"
    />
    <summary-panel
      v-if="!loading"
      :category-summaries="categorySummaries"
      :query-start-date-moment="queryStartDateMoment"
      :query-end-date-moment="queryEndDateMoment"
    />
    <chart-panel
      :category-summaries="categorySummaries"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import moment from 'moment';
import { mapGetters } from 'vuex';
import get from 'lodash/get';
import TransactionAnalysisHelper from '../helpers/TransactionAnalysis';
import TransactionsTable from './TransactionsTable';
import SummaryPanel from './SummaryPanel';
import ChartPanel from './ChartPanel';

export default {
  name: 'TransactionAnalysisHolder',
  components: { ChartPanel, SummaryPanel, TransactionsTable },
  data: function () {
    return {
      transactions: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      compareOption: 'app/compareOption',
    }),

    /**
     * @returns {*|moment.Moment|number|*|{start, end}|never}
     */
    compareDates() {
      return TransactionAnalysisHelper.GetCompareDateRange(this.compareOption);
    },

    /**
     * @returns {moment.Moment}
     */
    queryEndDateMoment() {
      return moment(this.compareDates.end);
    },

    /**
     * @returns {moment.Moment}
     */
    queryStartDateMoment() {
      return moment(this.compareDates.start);
    },

    /**
     * @returns {*|Array}
     */
    categorySummaries() {
      return TransactionAnalysisHelper.GetCategorySummaries(
        this.transactions,
        this.queryEndDateMoment,
        this.queryStartDateMoment,
        true,
        true
      );
    },

    transactionsTrigger() {
      this.fetchTransactions();
      return this.compareDates;
    },
  },
  methods: {
    async fetchTransactions() {
      this.loading = true;
      let page = 0;
      let lastPage = false;
      let transactions = [];
      while (!lastPage) {
        page++;
        const res = await this.$apollo.query({
          query: gql`
            query user($end_date: String!, $start_date: String!, $page: Int!) {
              user {
                id
                transactions(end_date: $end_date, start_date: $start_date, page: $page) {
                    transactions {
                      amount
                      status
                      is_transfer
                      date
                      payee
                      note
                      category {
                        id
                        title
                      }
                    }
                    pageInfo {
                        lastPage
                    }
                }
              }
            }`,
          variables: {
            page,
            end_date: this.queryEndDateMoment.format('YYYY-MM-DD'),
            start_date: this.queryStartDateMoment.format('YYYY-MM-DD'),
          }
        })
        const newTransactions = get(res, 'data.user.transactions.transactions', []);
        const newLastPage = get(res, 'data.user.transactions.pageInfo.lastPage', true);
        transactions.push(...newTransactions);
        lastPage = newLastPage;
      }
      this.loading = false;
      this.transactions = transactions;
    }
  }
};
</script>
