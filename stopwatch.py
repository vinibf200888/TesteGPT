import tkinter as tk


class Stopwatch(tk.Toplevel):
    """Simple stopwatch to count elapsed time."""

    def __init__(self, master=None):
        super().__init__(master)
        self.title("Cron\u00f4metro")
        self.resizable(False, False)
        self.configure(bg="white")

        self.elapsed = 0
        self.running = False
        self.after_id = None

        self.label = tk.Label(
            self,
            text="00:00:00",
            font=('Arial', 40),
            bg="white",
            fg="#003366",
        )
        self.label.pack(padx=20, pady=20)

        control_frame = tk.Frame(self, bg="white")
        control_frame.pack(pady=10)

        btn_opts = {
            "width": 8,
            "bg": "#d0e7ff",
            "activebackground": "#a0cfff",
        }

        tk.Button(control_frame, text="Iniciar", command=self.start, **btn_opts).pack(side=tk.LEFT, padx=5)
        tk.Button(control_frame, text="Parar", command=self.stop, **btn_opts).pack(side=tk.LEFT, padx=5)
        tk.Button(control_frame, text="Reset", command=self.reset, **btn_opts).pack(side=tk.LEFT, padx=5)

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
