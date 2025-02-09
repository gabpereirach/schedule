"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Brain, Calculator, FlaskRound, Palette, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

// Types définissant la structure des données
type Grade = {
  id: string;      // Identifiant unique de la note
  title: string;   // Titre du devoir/examen
  grade: number;   // Note obtenue
  year: number;    // Année scolaire
  semester: number; // Semestre
};

type Subject = {
  id: string;                        // Identifiant unique de la matière
  name: string;                      // Nom de la matière
  icon: keyof typeof subjectIcons;   // Icône associée à la matière
  grades: Grade[];                   // Liste des notes de la matière
  visible: boolean;                  // État de visibilité de la matière
};

// Définition des icônes disponibles pour les matières
const subjectIcons = {
  Calculator: <Calculator className="w-5 h-5" />, // Mathématiques
  Brain: <Brain className="w-5 h-5" />,          // Sciences cognitives
  Flask: <FlaskRound className="w-5 h-5" />,     // Sciences
  Palette: <Palette className="w-5 h-5" />,      // Arts
  Book: <Book className="w-5 h-5" />,            // Littérature
};

// Calcule la moyenne des notes
// Retourne 0 si aucune note n'est présente
const calculateAverage = (grades: Grade[]) => 
  grades.length ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length : 0;

// Années et semestres disponibles pour le filtrage
const years = [2024, 2023, 2022, 2021];
const semesters = [1, 2];

export default function Home() {
  // État des matières avec des données initiales
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "math",
      name: "Mathématiques",
      icon: "Calculator",
      grades: [
        { id: "m1", title: "Algèbre", grade: 16, year: 2024, semester: 1 },
        { id: "m2", title: "Géométrie", grade: 15, year: 2024, semester: 1 },
      ],
      visible: true,
    },
    {
      id: "physics",
      name: "Physique",
      icon: "Flask",
      grades: [
        { id: "p1", title: "Mécanique", grade: 14, year: 2024, semester: 1 },
      ],
      visible: true,
    },
  ]);

  // États pour le filtrage et l'ajout de données
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [newSubject, setNewSubject] = useState({ name: "", icon: "Book" as keyof typeof subjectIcons });
  const [newGrade, setNewGrade] = useState({ title: "", grade: "" });

  // Ajoute une nouvelle matière à la liste
  const addSubject = () => {
    if (!newSubject.name) return;
    setSubjects(prev => [...prev, {
      id: Date.now().toString(),
      name: newSubject.name,
      icon: newSubject.icon,
      grades: [],
      visible: true,
    }]);
    setNewSubject({ name: "", icon: "Book" }); // Réinitialise le formulaire
  };

  // Ajoute une nouvelle note à une matière
  const addGrade = (subjectId: string) => {
    if (!newGrade.title || !newGrade.grade) return;
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId ? {
        ...subject,
        grades: [...subject.grades, {
          id: Date.now().toString(),
          title: newGrade.title,
          grade: Number(newGrade.grade),
          year: selectedYear,
          semester: selectedSemester,
        }]
      } : subject
    ));
    setNewGrade({ title: "", grade: "" }); // Réinitialise le formulaire
  };

  // Supprime une note d'une matière
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
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId ? { ...subject, visible: !subject.visible } : subject
    ));
  };

  // Filtre les notes par année et semestre sélectionnés
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
          {/* Panneau latéral avec la liste des matières */}
          <div className="col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Matières</CardTitle>
                {/* Dialog pour ajouter une nouvelle matière */}
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
                        <Label>Icône</Label>
                        <Select
                          value={newSubject.icon}
                          onValueChange={value => setNewSubject(prev => ({ ...prev, icon: value as keyof typeof subjectIcons }))}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(subjectIcons).map(([key]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {subjectIcons[key as keyof typeof subjectIcons]}
                                  {key}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addSubject}>Ajouter</Button>
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
                      <SelectContent>
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
                      <SelectContent>
                        {semesters.map(semester => (
                          <SelectItem key={semester} value={semester.toString()}>
                            Semestre {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Liste des matières filtrées */}
                <div className="space-y-2">
                  {subjects.filter(hasGradesInPeriod).map(subject => (
                    <div key={subject.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        {subjectIcons[subject.icon]}
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
                </div>
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
                
                  return (
                    <Card key={subject.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                          {subjectIcons[subject.icon]}
                          {subject.name}
                        </CardTitle>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {selectedYear} - S{selectedSemester}
                          </span>
                          <span className="font-semibold">
                            Moyenne: {average.toFixed(2)}/20
                          </span>
                          {/* Dialog pour ajouter une nouvelle note */}
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
                                    min="0"
                                    max="20"
                                    value={newGrade.grade}
                                    onChange={e => setNewGrade(prev => ({ ...prev, grade: e.target.value }))}
                                  />
                                </div>
                                <Button onClick={() => addGrade(subject.id)}>Ajouter</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      {/* Liste des notes de la matière */}
                      <CardContent>
                        <div className="space-y-2">
                          {periodGrades.map(grade => (
                            <div key={grade.id} className="flex items-center justify-between py-2 border-b">
                              <span>{grade.title}</span>
                              <div className="flex items-center gap-4">
                                <span className="font-semibold">{grade.grade}/20</span>
                                {/* Indicateur visuel de la note */}
                                <div className={`w-2 h-2 rounded-full ${
                                  grade.grade >= 16 ? "bg-green-500" :  // Très bien
                                  grade.grade >= 14 ? "bg-yellow-500" : // Bien
                                  "bg-red-500"                         // À améliorer
                                }`} />
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
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}