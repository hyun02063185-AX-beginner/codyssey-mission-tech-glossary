"""import할 때 Decorator가 적용되고, 함수를 호출할 때 wrapper가 실행된다(Scene 02: import ≠ 함수 호출)."""
print("import 전")
import deco_tools  # noqa: E402  (시점을 보이려고 일부러 print 뒤에 둠)

print("import 뒤 · 아직 greet()를 호출하지 않음")
print("결과:", deco_tools.greet())
