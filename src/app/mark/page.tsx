"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { nanoid } from 'nanoid';

// Types définissant la structure des données
type Grade = {
	id: string;
	title: string;
	grade: number;
	year: number;
	semester: number;
};

type Subject = {
	id: string;
	name: string;
	grades: Grade[];
	visible: boolean;
};

// Calcule la moyenne des notes
const calculateAverage = (grades: Grade[]) =>
	grades.length ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length : 0;

// Années et semestres disponibles pour le filtrage
const years = [2025, 2024, 2023, 2022, 2021];
const semesters = [1, 2, 3];

export default function Home() {
	// Données tests
	const [subjects, setSubjects] = useState<Subject[]>([
		{
			id: "1",
			name: "Mathématiques",
			grades: [
				{ id: "1", title: "Algèbre", grade: 5.5, year: 2025, semester: 1 },
				{ id: "2", title: "Géométrie", grade: 3.5, year: 2024, semester: 1 },
				{ id: "4", title: "Limits", grade: 5.5, year: 2024, semester: 1 },
			],
			visible: true,
		},
		{
			id: "2",
			name: "Physique",
			grades: [
				{ id: "3", title: "Mécanique", grade: 4, year: 2024, semester: 1 },
			],
			visible: true,
		},
	]);

	// États pour le filtrage et l'ajout de données
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedSemester, setSelectedSemester] = useState(1);
	const [newSubject, setNewSubject] = useState({ name: "" });
	const [newGrade, setNewGrade] = useState({ title: "", grade: "" });

	// Ajoute une matière 
	const addSubject = () => {
		if (!newSubject.name) return;
		const newSubjectData = {
			id: nanoid(),
			name: newSubject.name,
			grades: [{
				id: nanoid(),
				title: newGrade.title,
				grade: Number(newGrade.grade),
				year: selectedYear,
				semester: selectedSemester,
			}],
			visible: true,
		};

		setSubjects(prev => [...prev, newSubjectData]);
		setNewSubject({ name: "" });
		setNewGrade({ title: "", grade: "" });
	};

	// Ajoute une note 
	const addGrade = (subjectId: string) => {
		if (!newGrade.title || !newGrade.grade) return;
		setSubjects(prev => prev.map(subject => subject.id === subjectId ? {
			...subject,
			grades: [...subject.grades, {
				id: nanoid(),
				title: newGrade.title,
				grade: Number(newGrade.grade),
				year: selectedYear,
				semester: selectedSemester,
			}]
		} : subject));
		setNewGrade({ title: "", grade: "" });
	};

	// Modifie une matière 
	const updateSubject = (subjectId: string, newName: string) => {
		setSubjects(prev => prev.map(subject => subject.id === subjectId ? { 
			...subject, 
			name: newName 
		}: subject));
		setNewSubject({ name: "" });
	}

	// Modifie une matière 
	const updateGrade = (gradeId: string, newTitle: string, newGrade: number) => {
		setSubjects(prev => prev.map(subject => ({
			...subject,
			grades: subject.grades.map(grade => grade.id === gradeId ? { 
				...grade, 
				title: newTitle, 
				grade: newGrade 
			} : grade )
		})));
		setNewGrade({ title: "", grade: "" });
	};

	// Supprime une note 
	const deleteGrade = (subjectId: string, gradeId: string) => {
		setSubjects(prev => prev.map(subject =>
			subject.id === subjectId ? {
				...subject,
				grades: subject.grades.filter(grade => grade.id !== gradeId)
			} : subject
		));
	};

	// Bascule la visibilité d'une matière
	const toggleVisibility = (subjectId: string) => {
		setSubjects(prev => prev.map(subject => subject.id === subjectId ? { 
			...subject, 
			visible: !subject.visible 
		} : subject ));
	};

	// Filtre les notes par année et semestre
	const filteredGrades = (grades: Grade[]) =>
		grades.filter(grade => grade.year === selectedYear && grade.semester === selectedSemester);

	// Vérifie si une matière a des notes dans la période sélectionnée
	const hasGradesInPeriod = (subject: Subject) =>
		subject.grades.some(grade => grade.year === selectedYear && grade.semester === selectedSemester);

	return (
		<div className="p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">Carnet de Notes</h1>
				<div className="grid grid-cols-12 gap-6">
					{/* Box latéral avec la liste des matières */}
					<div className="col-span-3">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0">
								<CardTitle>Matières</CardTitle>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Ajouter une matière</DialogTitle>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid gap-2">
												<Label>Nom</Label>
												<Input
													value={newSubject.name}
													onChange={e => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
												/>
											</div>
											<div className="grid gap-2">
												<Label>Titre</Label>
												<Input
													value={newGrade.title}
													onChange={e => setNewGrade(prev => ({ ...prev, title: e.target.value }))}
												/>
											</div>
											<div className="grid gap-2">
												<Label>Note</Label>
												<Input
													type="number"
													min="1"
													max="6"
													value={newGrade.grade}
													onChange={e => setNewGrade(prev => ({ ...prev, grade: e.target.value }))}
												/>
											</div>
											<Button variant="outline" size="textButton" onClick={addSubject}>Ajouter</Button>
										</div>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<CardContent>
								{/* Filtres année/semestre */}
								<div className="space-y-4 mb-4">
									<div className="grid gap-2">
										<Label>Année</Label>
										<Select value={selectedYear.toString()} onValueChange={value => setSelectedYear(Number(value))}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent className="bg-white">
												{years.map(year => (
													<SelectItem key={year} value={year.toString()}>{year}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-2">
										<Label>Semestre</Label>
										<Select value={selectedSemester.toString()} onValueChange={value => setSelectedSemester(Number(value))}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent className="bg-white">
												{semesters.map(semester => (
													<SelectItem key={semester} value={semester.toString()}>
														Semestre {semester != 3 ? `${semester}` : "d'été"}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								{subjects.filter(hasGradesInPeriod).map(subject => (
									<div key={subject.id} className="flex items-center justify-between py-2">
										<div className="flex items-center gap-2">
											<span>{subject.name}</span>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleVisibility(subject.id)}
										>
											{subject.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
										</Button>
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Zone principale d'affichage des notes */}
					<div className="col-span-9">
						<div className="grid gap-6">
							{subjects
								.filter(subject => subject.visible && hasGradesInPeriod(subject))
								.map(subject => {
									const periodGrades = filteredGrades(subject.grades);
									const average = calculateAverage(periodGrades);
									const formattedAverage = parseFloat(average.toFixed(2));

									return (
										<Card key={subject.id}>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="flex items-center gap-2">
													{subject.name}
												</CardTitle>
												<div className="flex items-center gap-4">
													<span className="text-sm text-muted-foreground">
														{selectedYear} - S{selectedSemester}
													</span>
													<span className="font-semibold">
														Moyenne: {formattedAverage}/6
													</span>
													<Dialog>
														<DialogTrigger asChild>
															<Button>
																<Pencil className="h-4 w-4" />
															</Button>
														</DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>Modifier la matière</DialogTitle>
															</DialogHeader>
															<div className="grid gap-4 py-4">
																<div className="grid gap-2">
																	<Label>Matière</Label>
																	<Input
																		value={newSubject.name || subject.name}
																		onChange={e => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
																	/>
																</div>
																<Button variant="outline" size="textButton" onClick={() => updateSubject(subject.id, newSubject.name)}>Modifier</Button>
															</div>
														</DialogContent>
													</Dialog>
													<Dialog>
														<DialogTrigger asChild>
															<Button variant="outline" size="icon">
																<Plus className="h-4 w-4" />
															</Button>
														</DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>Ajouter une note</DialogTitle>
															</DialogHeader>
															<div className="grid gap-4 py-4">
																<div className="grid gap-2">
																	<Label>Titre</Label>
																	<Input
																		value={newGrade.title}
																		onChange={e => setNewGrade(prev => ({ ...prev, title: e.target.value }))}
																	/>
																</div>
																<div className="grid gap-2">
																	<Label>Note</Label>
																	<Input
																		type="number"
																		min="1"
																		max="6"
																		value={newGrade.grade}
																		onChange={e => setNewGrade(prev => ({ ...prev, grade: e.target.value }))}
																	/>
																</div>
																<Button variant="outline" size="textButton" onClick={() => addGrade(subject.id)}>Ajouter</Button>
															</div>
														</DialogContent>
													</Dialog>
												</div>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													{periodGrades.map(grade => (
														<div key={grade.id} className="flex items-center justify-between py-2 border-b">
															<span className="font-semibold">{grade.title}</span>
															<div className="flex items-center gap-4">
																<span className="font-semibold">{grade.grade}/6</span>
																<span>{grade.year}</span>
																<Dialog>
																	<DialogTrigger asChild>
																		<Button>
																			<Pencil className="h-4 w-4" />
																		</Button>
																	</DialogTrigger>
																	<DialogContent>
																		<DialogHeader>
																			<DialogTitle>Modifier la note</DialogTitle>
																		</DialogHeader>
																		<div className="grid gap-4 py-4">
																			<div className="grid gap-2">
																				<Label>Titre</Label>
																				<Input
																					value={newGrade.title || grade.title}
																					onChange={e => setNewGrade(prev => ({ ...prev, title: e.target.value }))}
																				/>
																				<Label>Note</Label>
																				<Input
																					value={newGrade.grade || grade.grade}
																					onChange={e => setNewGrade(prev => ({ ...prev, grade: e.target.value }))}
																				/>
																			</div>
																			<Button variant="outline" size="textButton" onClick={() => updateGrade(grade.id, newGrade.title, parseFloat(newGrade.grade))}>Modifier</Button>
																		</div>
																	</DialogContent>
																</Dialog>
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => deleteGrade(subject.id, grade.id)}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									);
								})
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
