import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../constants/api";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

const PRIORIDADES = [
    { value: "baja", label: "Baja", color: colors.prioridadBaja },
    { value: "media", label: "Media", color: colors.prioridadMedia },
    { value: "alta", label: "Alta", color: colors.prioridadAlta },
    { value: "critica", label: "Crítica", color: colors.prioridadCritica },
];

export default function CrearTicketScreen() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [prioridad, setPrioridad] = useState("media");
    const [foto, setFoto] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function elegirDeGaleria() {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería");
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });

        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    }

    async function tomarFoto() {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert("Permiso requerido", "Necesitamos acceso a tu cámara");
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            quality: 0.7,
        });

        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    }

    async function handleCrearTicket() {
        if (!titulo || !descripcion) {
            Alert.alert("Campos incompletos", "Título y descripción son obligatorios");
            return;
        }

        setEnviando(true);
        try {
            const formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("descripcion", descripcion);
            formData.append("categoria", categoria);
            formData.append("ubicacion", ubicacion);
            formData.append("prioridad", prioridad);

            if (foto) {
                const nombreArchivo = foto.split("/").pop() || "foto.jpg";
                formData.append("foto", {
                    uri: foto,
                    name: nombreArchivo,
                    type: "image/jpeg",
                } as any);
            }

            await api.post("/tickets", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Alert.alert("Ticket creado", "Tu ticket se registró correctamente", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            const mensaje =
                error.response?.data?.mensaje || "No se pudo crear el ticket";
            Alert.alert("Error", mensaje);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>NUEVO TICKET</Text>

            <TextInput
                style={styles.input}
                placeholder="Título del problema"
                placeholderTextColor={colors.textMuted}
                value={titulo}
                onChangeText={setTitulo}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el problema con detalle"
                placeholderTextColor={colors.textMuted}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
            />

            <TextInput
                style={styles.input}
                placeholder="Categoría (ej. Hardware, Software, Red)"
                placeholderTextColor={colors.textMuted}
                value={categoria}
                onChangeText={setCategoria}
            />

            <TextInput
                style={styles.input}
                placeholder="Ubicación (ej. Piso 2, oficina 204)"
                placeholderTextColor={colors.textMuted}
                value={ubicacion}
                onChangeText={setUbicacion}
            />

            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.prioridadContainer}>
                {PRIORIDADES.map((p) => (
                    <TouchableOpacity
                        key={p.value}
                        style={[
                            styles.prioridadChip,
                            {
                                borderColor: p.color,
                                backgroundColor: prioridad === p.value ? p.color : "transparent",
                            },
                        ]}
                        onPress={() => setPrioridad(p.value)}
                    >
                        <Text
                            style={[
                                styles.prioridadText,
                                { color: prioridad === p.value ? colors.textPrimary : p.color },
                            ]}
                        >
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Fotografía (opcional)</Text>

            {foto && (
                <Image source={{ uri: foto }} style={styles.preview} />
            )}

            <View style={styles.fotoButtonsContainer}>
                <TouchableOpacity style={styles.fotoButton} onPress={tomarFoto}>
                    <Text style={styles.fotoButtonText}>Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fotoButton} onPress={elegirDeGaleria}>
                    <Text style={styles.fotoButtonText}>Elegir de galería</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleCrearTicket}
                disabled={enviando}
            >
                <Text style={styles.buttonText}>
                    {enviando ? "Creando..." : "Crear ticket"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
        paddingBottom: 60,
    },
    title: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.size.xl,
        marginBottom: 24,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    label: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.sm,
        marginBottom: 8,
    },
    prioridadContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 24,
    },
    prioridadChip: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    prioridadText: {
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.sm,
    },
    preview: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    fotoButtonsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    fotoButton: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },
    fotoButtonText: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.sm,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
});