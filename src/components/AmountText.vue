<template>
  <span>{{ amountFormatted }}</span>
</template>

<script>
import formatCurrency from 'format-currency';

export default {
  name: 'AmountText',
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    amountFormatted() {
      const f = formatCurrency(this.amount);
      if (this.amount >= 0) {
        return `$${f}`;
      }
      return `-$${f.substring(1)}`;
    },
  },
};
</script>
