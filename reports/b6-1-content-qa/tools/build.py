import sys, importlib, pathlib
sys.dont_write_bytecode = True
here = pathlib.Path(__file__).parent
sys.path.insert(0, str(here))
out = pathlib.Path(sys.argv[1])
mods = sys.argv[2:] or ["figs_a", "figs_b", "figs_c"]
out.mkdir(parents=True, exist_ok=True)
for m in mods:
    try:
        mod = importlib.import_module(m)
    except ModuleNotFoundError as e:
        if e.name == m:
            continue
        raise
    for name, fn in mod.FIGS.items():
        (out / name).write_text(fn(), encoding="utf-8", newline="\n")
        print("wrote", name)
