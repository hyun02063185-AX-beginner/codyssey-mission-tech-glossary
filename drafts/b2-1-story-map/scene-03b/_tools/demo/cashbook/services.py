"""서비스: 기능 수행과 처리 규칙(금액 검사, 없는 ID 판단, 검색 조건, 요약 계산)."""


class TransactionService:
    def __init__(self, repository):
        self.repository = repository

    def add(self, tx_type, category, amount):
        if amount < 1:
            raise ValueError("금액은 1 이상이어야 합니다")
        return self.repository.add(tx_type, category, amount)

    def list_all(self):
        return self.repository.all()

    def change_amount(self, tx_id, amount):
        if amount < 1:
            raise ValueError("금액은 1 이상이어야 합니다")
        tx = self.repository.update_amount(tx_id, amount)
        if tx is None:
            raise LookupError(f"id {tx_id} 거래가 없습니다")
        return tx

    def remove(self, tx_id):
        tx = self.repository.delete(tx_id)
        if tx is None:
            raise LookupError(f"id {tx_id} 거래가 없습니다")
        return tx

    def search(self, category=None, tx_type=None):
        found = []
        for tx in self.repository.all():
            if category is not None and tx.category != category:
                continue
            if tx_type is not None and tx.type != tx_type:
                continue
            found.append(tx)
        return found

    def summary(self):
        income = 0
        expense = 0
        by_category = {}
        for tx in self.repository.all():
            if tx.type == "수입":
                income += tx.amount
            else:
                expense += tx.amount
                by_category[tx.category] = by_category.get(tx.category, 0) + tx.amount
        return {"수입 합계": income, "지출 합계": expense, "잔액": income - expense, "분류별 지출": by_category}
