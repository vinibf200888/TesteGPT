import tkinter as tk


class Timer(tk.Toplevel):
    """Simple countdown timer."""

    def __init__(self, master=None):
        super().__init__(master)
        self.title("Timer")
        self.resizable(False, False)

        self.remaining = 0
        self.running = False
        self.after_id = None

        self.label = tk.Label(self, text="00:00:00", font=('Arial', 40))
        self.label.pack(padx=20, pady=20)

        input_frame = tk.Frame(self)
        input_frame.pack(pady=5)

        self.minutes_var = tk.StringVar(value="0")
        self.seconds_var = tk.StringVar(value="0")

        tk.Entry(input_frame, textvariable=self.minutes_var, width=3, justify='center').pack(side=tk.LEFT)
        tk.Label(input_frame, text=":").pack(side=tk.LEFT)
        tk.Entry(input_frame, textvariable=self.seconds_var, width=3, justify='center').pack(side=tk.LEFT)

        control_frame = tk.Frame(self)
        control_frame.pack(pady=10)

        tk.Button(control_frame, text="Iniciar", width=8, command=self.start).pack(side=tk.LEFT, padx=5)
        tk.Button(control_frame, text="Parar", width=8, command=self.stop).pack(side=tk.LEFT, padx=5)
        tk.Button(control_frame, text="Reset", width=8, command=self.reset).pack(side=tk.LEFT, padx=5)

    def _update(self):
        if self.running and self.remaining > 0:
            self.remaining -= 1
            m, s = divmod(self.remaining, 60)
            h, m = divmod(m, 60)
            self.label.config(text=f"{h:02d}:{m:02d}:{s:02d}")
            self.after_id = self.after(1000, self._update)
        else:
            self.running = False

    def start(self):
        if not self.running:
            if self.remaining == 0:
                try:
                    minutes = int(self.minutes_var.get())
                    seconds = int(self.seconds_var.get())
                except ValueError:
                    minutes = seconds = 0
                self.remaining = minutes * 60 + seconds
                m, s = divmod(self.remaining, 60)
                h, m = divmod(m, 60)
                self.label.config(text=f"{h:02d}:{m:02d}:{s:02d}")
            if self.remaining > 0:
                self.running = True
                self._update()

    def stop(self):
        if self.running:
            self.running = False
            if self.after_id:
                self.after_cancel(self.after_id)

    def reset(self):
        self.stop()
        self.remaining = 0
        self.label.config(text="00:00:00")
