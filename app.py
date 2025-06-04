import tkinter as tk

from calculator import Calculator
from timer import Timer


class MainMenu(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Menu")
        self.resizable(False, False)
        self.configure(padx=20, pady=20)

        tk.Button(self, text="Calculadora", width=15, command=self.open_calculator, font=('Arial', 14)).pack(pady=10)
        tk.Button(self, text="Timer", width=15, command=self.open_timer, font=('Arial', 14)).pack(pady=10)

    def open_calculator(self):
        Calculator(self)

    def open_timer(self):
        Timer(self)


if __name__ == '__main__':
    app = MainMenu()
    app.mainloop()
