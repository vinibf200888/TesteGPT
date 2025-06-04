import tkinter as tk


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
