"""저장소: 데이터 읽기·바꾸기. 이 장면에서는 메모리 목록을 쓴다(파일 저장은 Scene 04)."""
from cashbook.models import Transaction


class TransactionRepository:
    def __init__(self):
        self._items = [
            Transaction(1, "수입", "용돈", 30000),
            Transaction(2, "지출", "식비", 8000),
            Transaction(3, "지출", "교통", 2000),
            Transaction(4, "지출", "식비", 5000),
        ]

    def add(self, tx_type, category, amount):
        biggest = 0
        for tx in self._items:
            if tx.id > biggest:
                biggest = tx.id
        tx = Transaction(biggest + 1, tx_type, category, amount)
        self._items.append(tx)
        return tx

    def all(self):
        return list(self._items)

    def get(self, tx_id):
        for tx in self._items:
            if tx.id == tx_id:
                return tx
        return None

    def update_amount(self, tx_id, amount):
        tx = self.get(tx_id)
        if tx is not None:
            tx.amount = amount
        return tx

    def delete(self, tx_id):
        tx = self.get(tx_id)
        if tx is not None:
            self._items.remove(tx)
        return tx
