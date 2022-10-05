import os.path as ops

from lightning import LightningApp

from lightning_hpo import Sweep
from lightning_hpo.algorithm import RandomSearch
from lightning_hpo.distributions import Uniform

app = LightningApp(
    Sweep(
        script_path=ops.join(ops.dirname(__file__), "scripts/objective.py"),
        n_trials=3,
        simultaneous_trials=1,
        algorithm=RandomSearch(distributions={"x": Uniform(-10, 10)}),
    )
)
