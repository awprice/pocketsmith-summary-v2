<template>
  <div :dummy="transactionsTrigger">
    <transactions-table
        :loading="loading"
        :loading-text="loadingText"
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
import {mapGetters} from 'vuex';
import get from 'lodash/get';
import TransactionAnalysisHelper from '../helpers/TransactionAnalysis';
import TransactionsTable from './TransactionsTable';
import SummaryPanel from './SummaryPanel';
import ChartPanel from './ChartPanel';

export default {
  name: 'TransactionAnalysisHolder',
  components: {ChartPanel, SummaryPanel, TransactionsTable},
  data: function () {
    return {
      complete: 0,
      total: 0,
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

    loadingText() {
      if (this.total === 0) {
        return "Loading..."
      }
      return `Loaded ${this.complete} out of ${this.total}`;
    }
  },
  methods: {
    async fetchTransactions() {
      this.complete = 0;
      this.total = 0;
      this.loading = true;
      const firstPage = await this.fetchPageInfo(1);
      const lastPage = firstPage.pageInfo.lastPage;
      this.total = lastPage;
      this.transactions = await this.fetchMultiplePages(lastPage);
      this.loading = false;
    },

    async fetchMultiplePages(endPage) {
      const promises = [];
      for (let i = 1; i <= endPage; i++) {
        promises.push(this.fetchPagePromise(i).then((res) => {
          this.complete++;
          return res;
        }))
      }
      const result = await Promise.all(promises);
      const transactions = [];
      result.forEach((r) => {
        transactions.push(...get(r, 'data.user.transactions.transactions', []));
      })
      return transactions;
    },

    fetchPagePromise(page) {
      return this.$apollo.query({
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
    },

    async fetchPageInfo(page) {
      const res = await this.fetchPagePromise(page);
      return get(res, 'data.user.transactions', {
        pageInfo: {
          lastPage: 1,
        }
      })
    }
  }
};
</script>
