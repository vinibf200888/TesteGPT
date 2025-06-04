import tkinter as tk
from functools import partial


class Calculator(tk.Toplevel):
    def __init__(self, master=None):
        super().__init__(master)
        self.title("Calculadora")
        self.configure(bg='white')
        self.resizable(False, False)

        self.expression = ""

        self.entry = tk.Entry(
            self,
            font=('Arial', 20),
            bd=5,
            relief=tk.RIDGE,
            justify='right',
            bg='white',
        )
        self.entry.grid(row=0, column=0, columnspan=4, padx=10, pady=10, ipady=10)

        buttons = [
            ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
            ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
            ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
            ('0', 4, 0), ('.', 4, 1), ('=', 4, 2), ('+', 4, 3),
        ]

        btn_opts = {
            "width": 5,
            "height": 2,
            "font": ('Arial', 18),
            "bg": '#d0e7ff',
            "activebackground": '#a0cfff',
        }

        for (text, row, column) in buttons:
            action = partial(self.on_button_click, text)
            tk.Button(
                self,
                text=text,
                command=action,
                **btn_opts,
            ).grid(row=row, column=column, padx=5, pady=5)

        tk.Button(
            self,
            text='C',
            command=self.clear,
            **btn_opts,
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
