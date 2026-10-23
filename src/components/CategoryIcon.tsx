import React from 'react';
import {
  Utensils,
  Car,
  Zap,
  Home,
  HeartPulse,
  Film,
  GraduationCap,
  ShoppingBag,
  Receipt,
  PawPrint,
  Dumbbell,
  Plane,
  Coffee,
  Sparkles,
  Gift,
  Smartphone,
  Laptop,
  Briefcase,
  Music,
  Book,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { CategoryId } from '../types/budget';

export const AVAILABLE_CATEGORY_ICONS = [
  { id: 'Utensils', label: 'Comida', Icon: Utensils },
  { id: 'Car', label: 'Auto / Transporte', Icon: Car },
  { id: 'Zap', label: 'Servicios', Icon: Zap },
  { id: 'Home', label: 'Hogar', Icon: Home },
  { id: 'HeartPulse', label: 'Salud', Icon: HeartPulse },
  { id: 'Film', label: 'Cine / Ocio', Icon: Film },
  { id: 'GraduationCap', label: 'Educación', Icon: GraduationCap },
  { id: 'ShoppingBag', label: 'Compras', Icon: ShoppingBag },
  { id: 'Receipt', label: 'Recibo', Icon: Receipt },
  { id: 'PawPrint', label: 'Mascotas', Icon: PawPrint },
  { id: 'Dumbbell', label: 'Gimnasio', Icon: Dumbbell },
  { id: 'Plane', label: 'Viajes', Icon: Plane },
  { id: 'Coffee', label: 'Café / Bar', Icon: Coffee },
  { id: 'Sparkles', label: 'Belleza', Icon: Sparkles },
  { id: 'Gift', label: 'Regalos', Icon: Gift },
  { id: 'Smartphone', label: 'Móvil', Icon: Smartphone },
  { id: 'Laptop', label: 'Tecnología', Icon: Laptop },
  { id: 'Briefcase', label: 'Trabajo', Icon: Briefcase },
  { id: 'Music', label: 'Música', Icon: Music },
  { id: 'Book', label: 'Libros', Icon: Book },
  { id: 'Wrench', label: 'Mantenimiento', Icon: Wrench },
];

export const AVAILABLE_CATEGORY_COLORS = [
  { hex: '#059669', name: 'Esmeralda' },
  { hex: '#2563eb', name: 'Azul' },
  { hex: '#d97706', name: 'Ámbar' },
  { hex: '#7c3aed', name: 'Violeta' },
  { hex: '#e11d48', name: 'Rosa intenso' },
  { hex: '#8b5cf6', name: 'Púrpura' },
  { hex: '#0891b2', name: 'Cian' },
  { hex: '#db2777', name: 'Fucsia' },
  { hex: '#ea580c', name: 'Naranja' },
  { hex: '#0d9488', name: 'Teal' },
  { hex: '#475569', name: 'Gris pizarra' },
  { hex: '#16a34a', name: 'Verde bosque' },
];

interface CategoryIconProps {
  category?: CategoryId;
  iconName?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  iconName,
  className = 'w-4 h-4',
}) => {
  const target = iconName || category;

  switch (target) {
    case 'Utensils':
    case 'comida':
      return <Utensils className={className} />;
    case 'Car':
    case 'transporte':
      return <Car className={className} />;
    case 'Zap':
    case 'servicios':
      return <Zap className={className} />;
    case 'Home':
    case 'vivienda':
      return <Home className={className} />;
    case 'HeartPulse':
    case 'salud':
      return <HeartPulse className={className} />;
    case 'Film':
    case 'entretenimiento':
      return <Film className={className} />;
    case 'GraduationCap':
    case 'educacion':
      return <GraduationCap className={className} />;
    case 'ShoppingBag':
    case 'ropa':
      return <ShoppingBag className={className} />;
    case 'PawPrint':
    case 'mascotas':
      return <PawPrint className={className} />;
    case 'Dumbbell':
    case 'gimnasio':
    case 'gym':
      return <Dumbbell className={className} />;
    case 'Plane':
    case 'viajes':
      return <Plane className={className} />;
    case 'Coffee':
    case 'cafe':
      return <Coffee className={className} />;
    case 'Sparkles':
    case 'belleza':
      return <Sparkles className={className} />;
    case 'Gift':
    case 'regalos':
      return <Gift className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Book':
      return <Book className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Receipt':
    case 'otros':
    default:
      return <Receipt className={className} />;
  }
};
