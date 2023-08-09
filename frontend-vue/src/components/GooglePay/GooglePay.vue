<script lang="ts" setup></script>
<template>
  <div>
    <google-pay-button environment="TEST" button-type="donate" button-color="black" buttonLocale="zh"
      v-bind:paymentRequest.prop="{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId',
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: '100.00',
          currencyCode: 'USD',
          countryCode: 'US',
        },
      }" v-on:loadpaymentdata="onLoadPaymentData" v-on:error="onError"></google-pay-button>
  </div>
</template>

<script lang="ts">
import "@google-pay/button-element";
export default {
  data: () => ({
    buttonColor: "default",
    buttonType: "buy",
    isCustomSize: false,
    buttonWidth: 240,
    buttonHeight: 40,
    isTop: window === window.top,

    paymentRequest: {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example",
              gatewayMerchantId: "exampleGatewayMerchantId",
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: "12345678901234567890",
        merchantName: "Demo Merchant",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPriceLabel: "Total",
        totalPrice: "100.00",
        currencyCode: "USD",
        countryCode: "US",
      },
    },
  }),
  methods: {
    onLoadPaymentData: () => {

    },
    onError: (error: Error) => {
      console.error("error", error);
    },
  },
};
</script>
<style lang=""></style>
