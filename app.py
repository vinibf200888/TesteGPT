import tkinter as tk

from calculator import Calculator
from timer import Timer
from stopwatch import Stopwatch


class MainMenu(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Menu")
        self.resizable(False, False)
        self.configure(padx=20, pady=20, bg='white')

        btn_opts = {
            "width": 15,
            "font": ("Arial", 14),
            "bg": "#d0e7ff",
            "activebackground": "#a0cfff",
        }

        tk.Button(self, text="Calculadora", command=self.open_calculator, **btn_opts).pack(pady=10)
        tk.Button(self, text="Timer", command=self.open_timer, **btn_opts).pack(pady=10)
        tk.Button(self, text="Cronômetro", command=self.open_stopwatch, **btn_opts).pack(pady=10)

    def open_calculator(self):
        Calculator(self)

    def open_timer(self):
        Timer(self)

    def open_stopwatch(self):
        Stopwatch(self)


if __name__ == '__main__':
    app = MainMenu()
    app.mainloop()
