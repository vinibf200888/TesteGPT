import tkinter as tk
from functools import partial


class Calculator(tk.Toplevel):
    def __init__(self, master=None):
        super().__init__(master)
        self.title("Calculadora")
        self.configure(bg='lightgray')
        self.resizable(False, False)

        self.expression = ""

        self.entry = tk.Entry(self, font=('Arial', 20), bd=5, relief=tk.RIDGE, justify='right')
        self.entry.grid(row=0, column=0, columnspan=4, padx=10, pady=10, ipady=10)

        buttons = [
            ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
            ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
            ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
            ('0', 4, 0), ('.', 4, 1), ('=', 4, 2), ('+', 4, 3),
        ]

        for (text, row, column) in buttons:
            action = partial(self.on_button_click, text)
            tk.Button(
                self,
                text=text,
                width=5,
                height=2,
                font=('Arial', 18),
                command=action
            ).grid(row=row, column=column, padx=5, pady=5)

        tk.Button(
            self,
            text='C',
            width=5,
            height=2,
            font=('Arial', 18),
            command=self.clear
        ).grid(row=5, column=0, columnspan=4, padx=5, pady=5, sticky='we')

    def on_button_click(self, char):
        if char == '=':
            try:
                result = str(eval(self.expression))
                self.entry.delete(0, tk.END)
                self.entry.insert(tk.END, result)
                self.expression = result
            except Exception:
                self.entry.delete(0, tk.END)
                self.entry.insert(tk.END, 'Erro')
                self.expression = ""
        else:
            self.expression += str(char)
            self.entry.delete(0, tk.END)
            self.entry.insert(tk.END, self.expression)

    def clear(self):
        self.expression = ""
        self.entry.delete(0, tk.END)


class Timer(tk.Toplevel):
    def __init__(self, master=None):
        super().__init__(master)
        self.title("Timer")
        self.resizable(False, False)

        self.elapsed = 0
        self.running = False
        self.after_id = None

        self.label = tk.Label(self, text="00:00:00", font=('Arial', 40))
        self.label.pack(padx=20, pady=20)

        control_frame = tk.Frame(self)
        control_frame.pack(pady=10)

        tk.Button(control_frame, text="Iniciar", width=8, command=self.start).pack(side=tk.LEFT, padx=5)
        tk.Button(control_frame, text="Parar", width=8, command=self.stop).pack(side=tk.LEFT, padx=5)
        tk.Button(control_frame, text="Reset", width=8, command=self.reset).pack(side=tk.LEFT, padx=5)

    def _update(self):
        if self.running:
            self.elapsed += 1
            h = self.elapsed // 3600
            m = (self.elapsed % 3600) // 60
            s = self.elapsed % 60
            self.label.config(text=f"{h:02d}:{m:02d}:{s:02d}")
            self.after_id = self.after(1000, self._update)

    def start(self):
        if not self.running:
            self.running = True
            self._update()

    def stop(self):
        if self.running:
            self.running = False
            if self.after_id:
                self.after_cancel(self.after_id)

    def reset(self):
        self.stop()
        self.elapsed = 0
        self.label.config(text="00:00:00")


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
