// src/services/authService.ts
import { StorageAdapter } from "../config/adapters/storage-adapter";
import { api } from "../config/apis/api";

export const getClientesRequest = async () => {
  const { data } = await api.get(`/users/clientes`);
  return data;
};

export const getRecordatoriosRequest = async () => {
  const { data } = await api.get(`/users/profesionales/recordatorios`);
  return data;
};

export const updateEmailRequest = async (email: string) => {
  const { data } = await api.patch(`/users/email`, { email });
  return data;
};

export const updatePasswordRequest = async (
  password: string,
  newPassword: string
) => {
  const { data } = await api.patch(`/users/password`, {
    oldPassword: password,
    newPassword,
  });
  return data;
};

export const uploadImageRequest = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await api.post(`/users/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const uploadCertificateRequest = async (
  userTipoProfesionalId: number,
  userId: number,
  certificate: File
) => {
  const formData = new FormData();
  formData.append("userTipoProfesionalId", userTipoProfesionalId.toString());
  formData.append("userId", userId.toString());
  formData.append("certificate", certificate);
  const { data } = await api.post(
    `/users/profesionales/certificado`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const getUserImageRequest = async (id: number) => {
  const { data } = await api.get(`/users/image/${id}`);
  return data;
};

export const getProfesionalsByUserForTicketsCreationRequest = async (
  userId: number
) => {
  const { data } = await api.get(`/users/profesionales/tickets/${userId}`);
  return data;
};

export const getUserByDNIForProfesional = async (dni: string) => {
  const { data } = await api.get(`/users/profesionales/${dni}`);
  return data;
};

export const postAsignarClienteRequest = async (clienteId: number) => {
  const { data } = await api.post(`/users/profesionales/asignar-usuario`, {
    clienteId,
  });
  return data;
};

export const getTipoProfesionalRequest = async () => {
  const { data } = await api.get(`/users/tipos-profesional`);
  return data;
};

export const getProfesionalesByAdminRequest = async () => {
  const { data } = await api.get(`/users/profesionales/all`);
  return data;
};

export const setBajaOrCertificateRequest = async (
  userId: number,
  userTipoProfesionalId: number,
  isCertified: boolean
) => {
  const { data } = await api.patch("/users/aprobar-profesional", {
    userId,
    userTipoProfesionalId,
    isCertified,
  });
  return data;
};

export const downloadCertificateRequest = async (
  profesionalId: number,
  userTipoProfesionalId: number
): Promise<void> => {
  try {
    const url = `${api.defaults.baseURL}/users/archivo/${profesionalId}/${userTipoProfesionalId}`;
    const user = await StorageAdapter.getItem("user");
    const headers: Record<string, string> = {};
    if (user && (user as { token: string }).token) {
      headers["Authorization"] = `Bearer ${(user as { token: string }).token}`;
    }

    // Realiza la petición para obtener el certificado en formato blob
    const response = await api.get(url, {
      headers,
      responseType: "blob",
    });

    if (response.status === 200) {
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      // Determinar la extensión a partir del Content-Type
      let extension = "pdf";
      const contentType = response.headers["content-type"];
      if (contentType) {
        if (contentType.includes("application/pdf")) {
          extension = "pdf";
        } else if (contentType.includes("image/png")) {
          extension = "png";
        } else if (contentType.includes("image/jpeg")) {
          extension = "jpeg";
        } else {
          extension = "bin";
        }
      }

      link.href = blobUrl;
      link.setAttribute(
        "download",
        `certificado_${profesionalId}_${userTipoProfesionalId}.${extension}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      console.log(
        `Archivo descargado correctamente como certificado_${profesionalId}_${userTipoProfesionalId}.${extension}`
      );
    } else {
      throw new Error("Error al descargar el certificado");
    }
  } catch (error) {
    console.error("Error en la descarga:", error);
    alert("No se pudo descargar el certificado. Inténtalo de nuevo más tarde.");
  }
};
