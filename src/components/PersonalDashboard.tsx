import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudSun,
  Github,
  Plus,
} from "lucide-react";
import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type StoredTasks = {
  tasks: Task[];
  message: string;
};

const taskStorageKey = "nocterra-dashboard-tasks";
const weekdayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const taskPageSize = 2;
const heatmapCells = Array.from({ length: 364 });

function readTasks(): StoredTasks {
  try {
    const stored = window.localStorage.getItem(taskStorageKey);

    if (!stored) {
      return { tasks: [], message: "" };
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return {
        tasks: [],
        message: "Data tugas tidak terbaca. Tugas baru hanya berlaku selama sesi ini.",
      };
    }

    const tasks = parsed.filter(
      (item): item is Task =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.completed === "boolean",
    );

    return { tasks, message: "" };
  } catch {
    return {
      tasks: [],
      message: "Penyimpanan browser tidak tersedia. Tugas baru hanya berlaku selama sesi ini.",
    };
  }
}

function getLocalDateTime(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 19);
}

function CalendarCard({ today }: { today: Date }) {
  const [shownMonth, setShownMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(shownMonth);
  const longDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  });
  const firstWeekday = (shownMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(
    shownMonth.getFullYear(),
    shownMonth.getMonth() + 1,
    0,
  ).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  function changeMonth(amount: number) {
    setShownMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + amount, 1),
    );
  }

  return (
    <section className="dashboard-card calendar-card" id="calendar">
      <header className="card-heading">
        <div className="card-heading__title">
          <CalendarDays aria-hidden="true" size={18} />
          <h2>Kalender</h2>
        </div>
        <div
          className="calendar-controls"
          role="group"
          aria-label="Navigasi kalender"
        >
          <button
            className="icon-button"
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </header>
      <p className="calendar-month" aria-live="polite">
        {monthLabel}
      </p>
      <div
        className="calendar-grid"
        style={
          {
            "--calendar-weeks": cellCount / 7,
          } as CSSProperties & Record<"--calendar-weeks", number>
        }
      >
        {weekdayNames.map((day) => (
          <span className="calendar-weekday" key={day}>
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return (
              <span
                className="calendar-day calendar-day--empty"
                aria-hidden="true"
                key={`empty-${index}`}
              />
            );
          }

          const date = new Date(
            shownMonth.getFullYear(),
            shownMonth.getMonth(),
            day,
          );
          const isToday =
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === day;
          const dateTime = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(day).padStart(2, "0"),
          ].join("-");

          return (
            <time
              className={`calendar-day${isToday ? " calendar-day--today" : ""}`}
              dateTime={dateTime}
              aria-label={longDate.format(date)}
              aria-current={isToday ? "date" : undefined}
              key={dateTime}
            >
              {day}
            </time>
          );
        })}
      </div>
    </section>
  );
}

function TodoCard() {
  const [storedTasks] = useState(readTasks);
  const [tasks, setTasks] = useState(storedTasks.tasks);
  const [storageMessage, setStorageMessage] = useState(storedTasks.message);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(tasks.length / taskPageSize);
  const visibleTasks = tasks.slice(
    page * taskPageSize,
    (page + 1) * taskPageSize,
  );

  useEffect(() => {
    if (storageMessage) {
      return;
    }

    try {
      window.localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
    } catch {
      setStorageMessage(
        "Penyimpanan browser tidak tersedia. Tugas baru hanya berlaku selama sesi ini.",
      );
    }
  }, [storageMessage, tasks]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();

    if (!title) {
      return;
    }

    setPage(Math.floor(tasks.length / taskPageSize));
    setTasks((currentTasks) => [
      ...currentTasks,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
    setDraft("");
    setIsAdding(false);
  }

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <section className="dashboard-card todo-card" id="tasks">
      <header className="card-heading">
        <div className="card-heading__title">
          <h2>Tugas</h2>
        </div>
        <button
          className="icon-button todo-add-button"
          type="button"
          aria-label={isAdding ? "Tutup formulir tugas" : "Tambah tugas"}
          aria-expanded={isAdding}
          onClick={() => setIsAdding((open) => !open)}
        >
          <Plus aria-hidden="true" size={19} />
        </button>
      </header>

      {isAdding && (
        <form className="todo-form" onSubmit={addTask}>
          <label htmlFor="new-task">Tugas baru</label>
          <div className="todo-form__row">
            <input
              autoFocus
              id="new-task"
              maxLength={64}
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
            />
            <button className="text-button" type="submit" disabled={!draft.trim()}>
              Simpan
            </button>
          </div>
        </form>
      )}

      {visibleTasks.length > 0 ? (
        <ul className="todo-list">
          {visibleTasks.map((task) => (
            <li className="todo-item" key={task.id}>
              <label className="todo-item__label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? "is-complete" : undefined}>
                  {task.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state todo-empty">
          <p>Belum ada tugas.</p>
          {!isAdding && (
            <button
              className="text-button"
              type="button"
              onClick={() => setIsAdding(true)}
            >
              Tambah tugas
            </button>
          )}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="task-pagination" aria-label="Halaman daftar tugas">
          <button
            className="icon-button"
            type="button"
            aria-label="Tugas sebelumnya"
            disabled={page === 0}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <span>
            {page + 1} / {pageCount}
          </span>
          <button
            className="icon-button"
            type="button"
            aria-label="Tugas berikutnya"
            disabled={page === pageCount - 1}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </nav>
      )}

      {storageMessage && (
        <p className="storage-message" role="status">
          {storageMessage}
        </p>
      )}
    </section>
  );
}

function ScheduleCard() {
  return (
    <section className="dashboard-card schedule-card" id="schedule">
      <header className="card-heading">
        <div className="card-heading__title">
          <Clock3 aria-hidden="true" size={18} />
          <h2>Agenda mendatang</h2>
        </div>
      </header>
      <div className="empty-state">
        <p>Belum ada agenda yang terhubung.</p>
      </div>
    </section>
  );
}

function WeatherCard() {
  return (
    <section className="dashboard-card weather-card" aria-labelledby="weather-title">
      <header className="card-heading">
        <div className="card-heading__title">
          <CloudSun aria-hidden="true" size={19} />
          <h2 id="weather-title">Cuaca lokal</h2>
        </div>
      </header>
      <div className="weather-state">
        <p>Sumber cuaca belum terhubung.</p>
      </div>
    </section>
  );
}

function GitHubCard() {
  return (
    <section className="dashboard-card github-card" aria-labelledby="github-title">
      <header className="card-heading">
        <div className="card-heading__title">
          <Github aria-hidden="true" size={19} />
          <h2 id="github-title">Kontribusi GitHub</h2>
        </div>
      </header>
      <p className="github-message">
        Hubungkan GitHub untuk menampilkan aktivitas.
      </p>
      <div className="heatmap" aria-hidden="true">
        {heatmapCells.map((_, index) => (
          <span className="heatmap-cell" key={index} />
        ))}
      </div>
    </section>
  );
}

function PersonalDashboard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting =
    now.getHours() < 4
      ? "dini hari"
      : now.getHours() < 11
        ? "pagi"
        : now.getHours() < 15
          ? "siang"
          : now.getHours() < 19
            ? "sore"
            : "malam";
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const timeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
  const secondsLabel = String(now.getSeconds()).padStart(2, "0");

  return (
    <main className="dashboard-page" id="main-content" aria-labelledby="dashboard-title">
      <a className="skip-link" href="#main-content">
        Langsung ke isi
      </a>
      <header className="topbar" id="overview">
        <a className="wordmark" href="#overview" aria-label="NOCTERRA, ringkasan">
          NOCTERRA
        </a>
        <nav className="top-navigation" aria-label="Navigasi utama">
          <a href="#calendar">Kalender</a>
          <a href="#tasks">Tugas</a>
          <a href="#schedule">Agenda</a>
        </nav>
      </header>

      <section className="dashboard-intro" aria-label="Waktu dan tanggal saat ini">
        <div className="dashboard-intro__copy">
          <p className="date-label">{dateLabel}</p>
          <h1 id="dashboard-title">Selamat {greeting}</h1>
        </div>
        <time
          className="digital-clock"
          dateTime={getLocalDateTime(now)}
          aria-label={`${timeLabel}:${secondsLabel}`}
        >
          <span>{timeLabel}</span>
          <span className="clock-seconds">{secondsLabel}</span>
        </time>
      </section>

      <div className="dashboard-grid">
        <CalendarCard today={now} />
        <TodoCard />
        <ScheduleCard />
        <WeatherCard />
        <GitHubCard />
      </div>
    </main>
  );
}

export default PersonalDashboard;
