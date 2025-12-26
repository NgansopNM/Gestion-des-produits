import React, { useState } from 'react';

function Todo() {
	// state
	const [task, setTask] = useState("");
	const [err, setErr] = useState("");
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("all"); // all, active, completed

	const handleAddTask = () => {
		if (task.trim() === "") {
			setErr("Veuillez remplir une tâche");
			return;
		} else {
			setTasks([
				...tasks,
				{ id: Date.now(), text: task.trim(), completed: false },
			]);
			setTask("");
			setErr("");
		}
	};

	const handleToggleComplete = (id) => {
		setTasks(
			tasks.map((t) =>
				t.id === id ? { ...t, completed: !t.completed } : t
			)
		);
	};

	const handleDelete = (id) => {
		setTasks(tasks.filter((t) => t.id !== id));
	};

	const filteredTasks = tasks.filter((t) => {
		if (filter === "active") return !t.completed;
		if (filter === "completed") return t.completed;
		return true;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-red-500 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-lg bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/30">
				<h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-6">
					To‑Do List
				</h1>

				{/* Input + Add Button */}
				<div className="flex gap-2 mb-6">
					<input
						type="text"
						value={task}
						onChange={(e) => setTask(e.target.value)}
						placeholder="Ajouter une tâche..."
						className="flex-1 px-4 py-2 rounded-xl border border-white/40 bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/70"
						onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
					/>
					<button
						onClick={handleAddTask}
						className="px-5 py-2 bg-white/90 text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-white active:scale-95 transition"
					>
						Ajouter
					</button>
				</div>

				{err && (
					<p className="my-5 rounded-lg bg-slate-600 shadow-zinc-50 text-orange-500">
						{err}
					</p>
				)}

				{/* Filter Buttons */}
				<div className="flex justify-center gap-4 mb-6">
					{["all", "active", "completed"].map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-4 py-1 rounded-full border border-white/40 font-semibold text-sm transition ${
								filter === f
									? "bg-white/50 text-indigo-700"
									: "text-white/80 hover:bg-white/20"
							}`}
						>
							{f === "all"
								? "Toutes"
								: f === "active"
								? "Actives"
								: "Terminées"}
						</button>
					))}
				</div>

				{/* Task List */}
				<ul className="space-y-3">
					{filteredTasks.length === 0 && (
						<p className="text-white/70">Aucune tâche ici 😎</p>
					)}
					{filteredTasks.map((t) => (
						<li
							key={t.id}
							className="flex justify-between items-center bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-white hover:bg-white/30 transition"
						>
							<div
								onClick={() => handleToggleComplete(t.id)}
								className={`flex-1 cursor-pointer select-none ${
									t.completed ? "line-through text-white/60" : ""
								}`}
							>
								{t.text}
							</div>
							<button
								onClick={() => handleDelete(t.id)}
								className="text-red-500 hover:text-red-400 font-bold"
							>
								✕
							</button>
						</li>
					))}
				</ul>

				{/* Tasks count */}
				<p className="mt-6 text-white/80 text-sm">
					{tasks.filter((t) => !t.completed).length} tâche(s) restante(s)
				</p>
			</div>

			{/* Carrousel placé en dessous de la To‑Do list */}
			<div className="w-full max-w-4xl mt-10"></div>
		</div>
	);
}

export default Todo;