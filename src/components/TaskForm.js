import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

const CATEGORIES = ['Personal', 'Trabajo', 'Estudio'];

const TITLE_MIN_LENGTH = 5;
const DESCRIPTION_MIN_LENGTH = 10;

// Formulario de creacion de tareas. Es un componente "tonto": no
// sabe nada de navegacion ni de la lista completa, solo valida y
// delega la tarea nueva al padre via onAddTask (ver TaskFormScreen).
export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  // Guardamos que campos ya fueron "tocados" para no mostrar
  // errores antes de que el usuario haya interactuado con ellos.
  const [touched, setTouched] = useState({ title: false, description: false });
  const [focusedField, setFocusedField] = useState(null);

  const errors = {
    title:
      title.trim().length === 0
        ? 'El titulo es obligatorio'
        : title.trim().length < TITLE_MIN_LENGTH
        ? `El titulo debe tener al menos ${TITLE_MIN_LENGTH} caracteres`
        : null,
    description:
      description.trim().length === 0
        ? 'La descripcion es obligatoria'
        : description.trim().length < DESCRIPTION_MIN_LENGTH
        ? `La descripcion debe tener al menos ${DESCRIPTION_MIN_LENGTH} caracteres`
        : null,
  };

  const hasErrors = Boolean(errors.title || errors.description);

  const handleBlur = (field) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAddTask = () => {
    // Al intentar guardar marcamos todo como tocado para que
    // se vean los errores aunque el usuario no haya pasado por
    // cada campo individualmente.
    setTouched({ title: true, description: true });

    if (hasErrors) {
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      completed: false,
      createdAt: new Date(),
    };

    console.log('Nueva tarea:', task);
    // onAddTask guarda la tarea y navega de vuelta a la lista, asi
    // que esta pantalla se desmonta enseguida: no hace falta
    // resetear los campos, la proxima vez que se abra el formulario
    // arranca de cero por su propio estado inicial.
    onAddTask(task);
    Alert.alert('Exito', 'Tarea capturada localmente');
  };

  const getInputStyle = (field) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    touched[field] && errors[field] && styles.inputError,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Titulo</Text>
        <TextInput
          style={getInputStyle('title')}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocusedField('title')}
          onBlur={() => handleBlur('title')}
          placeholder="Ej: Terminar informe mensual"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          autoCapitalize="sentences"
          returnKeyType="next"
        />
        {touched.title && errors.title && (
          <Text style={styles.errorText}>{errors.title}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Descripcion</Text>
        <TextInput
          style={[getInputStyle('description'), styles.textArea]}
          value={description}
          onChangeText={setDescription}
          onFocus={() => setFocusedField('description')}
          onBlur={() => handleBlur('description')}
          placeholder="Agrega detalles sobre la tarea"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
          returnKeyType="done"
        />
        {touched.description && errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((item) => {
            const selected = item === category;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selected && styles.categoryChipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, hasErrors && styles.saveButtonDisabled]}
        onPress={handleAddTask}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>Guardar tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryDark,
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
