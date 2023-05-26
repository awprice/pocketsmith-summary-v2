<template>
  <div>
    <strong><amount-text
      :amount="amount"
    /></strong>
    {{ timeframeFormatted }}
  </div>
</template>

<script>
import AmountText from '@/components/AmountText.vue';
import moment from 'moment';

export default {
  name: 'BudgetAmount',
  components: { AmountText },
  props: {
    budget: {
      type: Object,
      required: true,
    },
  },
  methods: {
    shortenDuration(input) {
      switch (input) {
        case 'a year':
          return '/ yr';
        default:
          return input;
      }
    },
  },
  computed: {
    amount() {
      return this.budget.total_forecast_amount;
    },
    timeframeFormatted() {
      const start = moment(this.budget.start_date);
      const end = moment(this.budget.end_date);
      const humanizedDuration = moment.duration(end.diff(start)).humanize();
      return this.shortenDuration(humanizedDuration);
    },
  },
};
</script>
