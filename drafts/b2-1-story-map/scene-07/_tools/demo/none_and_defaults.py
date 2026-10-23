"""Argument를 생략할 수 있다(기본값)와 None을 허용한다(str | None)는 다른 이야기다."""


def greet(name: str = "친구") -> str:
    return f"안녕하세요, {name}"


def greet_optional(name: str | None = None) -> str:
    if name is None:
        name = "친구"
    return f"안녕하세요, {name}"


def category_label(category: str | None) -> str:
    if category is None:
        return "(분류 없음)"
    return category


print("greet() →", greet())
print('greet("민수") →', greet("민수"))
print("greet(None) →", greet(None))
print("greet_optional() →", greet_optional())
print("greet_optional(None) →", greet_optional(None))
print("category_label(None) →", category_label(None))
try:
    category_label()
except TypeError as error:
    print("category_label() → TypeError:", error)
