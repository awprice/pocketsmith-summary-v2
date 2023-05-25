<template>
  <el-table
    :data="transactions"
  >
    <el-table-column
      label="Date"
      prop="date"
      width="150"
    />
    <el-table-column label="Merchant">
      <template slot-scope="props">
        <strong>{{ props.row.payee }}</strong><br>
        {{ props.row.note }}
      </template>
    </el-table-column>
    <el-table-column
      label="Amount"
      prop="amount"
      width="150"
    >
      <template slot-scope="props">
        <amount-text :amount="props.row.amount"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import AmountText from './AmountText.vue';

export default {
  name: 'CategoryTransactionsTable',
  components: { AmountText },
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
};
</script>
