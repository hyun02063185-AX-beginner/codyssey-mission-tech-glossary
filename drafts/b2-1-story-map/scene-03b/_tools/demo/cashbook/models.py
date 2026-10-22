"""모델: 거래 한 건의 구조와 의미."""


class Transaction:
    def __init__(self, tx_id, tx_type, category, amount):
        self.id = tx_id
        self.type = tx_type
        self.category = category
        self.amount = amount
