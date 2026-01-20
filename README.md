这是一个whatsapp机器人的程序
当我在群里接收到类似
Done, we will settle USDT 7,829.15 (6672/0.8522) for you, could you please confirm the wallet address: TU47RNQWH6HC3rRvY288qxqY14pK3QSyGJ on Tron?
的文本时，我需要提取出其中的参数
比如7,829.15 6672 0.8522 
其中7,829.15 6672都要改成数字格式，然后调用一下接口
curl --request POST \
  --url https://dev.stablesapi.com/api/v1/trading \
  --header 'content-type: application/json' \
  --header 'x-api-key: XXX' \
  --data '{
  "client_id": 2,
  "transaction_type": "EUR-USDT",
  "payout_portal": "tron",
  "deposit_date": "2025-12-28",
  "settlement_date": "2025-12-28",
  "deposit_amount": 1000,
  "settled_amount": 1200,
  "quoted_ex_rate": "0.8333",
  "deposit_ccy": "EUR",
  "settled_ccy": "USDT",
  "onchain_tx_id": "toBeConfirm"
}'
7829.15参数设置到settled_amount
6672参数设置到deposit_amount
0.8522 参数设置到quoted_ex_rate
其余参数不变。

