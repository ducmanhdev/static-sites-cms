type GetFilesRequest = {
  id: number;
  project_id: number;
};

type CreateFileRequest = {
  file: File;
  path_file: string;
  project_id: number;
};

type UploadFolderRequest = {
  path_file: string[];
  file: File[];
  dir: string;
  project_id: number;
};

type UploadFilesRequest = {
  file: string[];
  dir: string;
  project_id: number;
};

type CutPathRequest = {
  path: string;
  to_path: string;
  project_id: number;
};

type ClonePathRequest = {
  path_file: string;
  project_id: number;
};

type DeletePathRequest = {
  path: string;
  project_id: number;
};

type ReadFileRequest = {
  project_id: number;
  path_file: string;
};

type EditFileRequest = {
  file: File;
  project_id: number;
  path_file: string;
};

type RenameFileRequest = {
  project_id: number;
  path_file: string;
  to_path_file: string;
};

type GetListTemplateRequest = {
  list_categories: string[];
};

type ViewTemplateRequest = {
  id: number;
};

type GetListProjectRequest = {
  organization_id: number;
  [K: string]: any;
};

type ViewProjectRequest = {
  id: number;
};

type CreateProjectRequest = {
  name: string;
  template_id: number;
  organization_id: number;
};

type GetProjectConfigRequest = {
  project_id: number;
};

type GetPathCollectionRequest = {
  project_id: number;
  collection: string;
};

type GetListOrganizationRequest = {
  [K: string]: any;
};

type ViewOrganizationRequest = {
  id: number;
};

type CreateOrganizationRequest = {
  name: string;
  status: number;
};

type DeleteOrganizationRequest = {
  id: number;
};

type ReadCollectionRequest = {
  project_id: number;
  collection: string;
  sub_path: string;
};

type GetProjectComponentConfigRequest = {
  project_id: number;
  sub_path?: string[];
};

type GetPublicAssetRequest = {
  project_id: number;
  path: string;
};

type UploadAssetRequest = {
  project_id: number;
  path: string;
  file: File;
};

type ReadLogRealtimeRequest = {
  id?: number;
  project_id: number;
  is_pending: true;
};

type EditPageRequest = {
  file: File;
  project_id: number;
  path_file: string;
};

type GetActivitiesRequest = {
  project_id: number;
  [K: string]: any;
};

type GetActivityRequest = {
  id: number;
};

type GetActivityDiffRequest = {
  id: number;
};

type GetProjectThumbnailRequest = {
  code: string;
  logIdLast: number;
  width?: number;
  height?: number;
};

type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
};

export const API = {
  getFiles(request: GetFilesRequest) {
    return $fetch('/api/v1/web_portal/project/project-path', {
      params: {
        id: request.id,
        project_id: request.project_id,
      },
    });
  },
  createFile(request: CreateFileRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/create-file', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  uploadFolder(request: UploadFolderRequest) {
    return $fetch('/api/v1/web_portal/project/project-path-upload/upload-folder', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  uploadFiles(request: UploadFilesRequest) {
    return $fetch('/api/v1/web_portal/project/project-path-upload/upload-file', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  cutPath(request: CutPathRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/cut', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  clonePath(request: ClonePathRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/clone', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  deletePath(request: DeletePathRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/delete', {
      method: 'POST',
      body: request,
    });
  },
  readFile(request: ReadFileRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/read-file', {
      params: request,
    });
  },
  editFile(request: EditFileRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/edit-file', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  renameFile(request: RenameFileRequest) {
    return $fetch('/api/v1/web_portal/project/project-path/rename-file', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  getListTemplate(request: GetListTemplateRequest) {
    return $fetch('/api/v1/web_portal/template/site', {
      params: request,
    });
  },
  viewTemplate(request: ViewTemplateRequest) {
    return $fetch('/api/v1/web_portal/template/site/view', {
      params: {
        id: request.id,
      },
    });
  },
  getListCategory() {
    return $fetch('/api/v1/web_portal/category/site/list');
  },
  getListProject(request: GetListProjectRequest) {
    return $fetch('/api/v1/web_portal/project/site', {
      params: {
        ...request,
      },
    });
  },
  viewProject(request: ViewProjectRequest) {
    return $fetch('/api/v1/web_portal/project/site/view', {
      params: {
        id: request.id,
      },
    });
  },
  createProject(request: CreateProjectRequest) {
    return $fetch('/api/v1/web_portal/project/form/create', {
      method: 'POST',
      body: {
        name: request.name,
        template_id: request.template_id,
        organization_id: request.organization_id,
      },
    });
  },
  getProjectConfig(request: GetProjectConfigRequest) {
    return $fetch('/api/v1/web_portal/project/config', {
      params: {
        project_id: request.project_id,
      },
    });
  },
  getListOrganization(request: GetListOrganizationRequest) {
    return $fetch('/api/v1/web_portal/organization/site', {
      params: {
        ...request,
      },
    });
  },
  viewOrganization(request: ViewOrganizationRequest) {
    return $fetch('/api/v1/web_portal/organization/site/view', {
      params: {
        id: request.id,
      },
    });
  },
  createOrganization(request: CreateOrganizationRequest) {
    return $fetch('/api/v1/web_portal/organization/form/create', {
      method: 'POST',
      body: {
        name: request.name,
        status: request.status,
      },
    });
  },
  deleteOrganization(request: DeleteOrganizationRequest) {
    return $fetch('/api/v1/web_portal/organization/form/delete', {
      method: 'POST',
      params: {
        id: request.id,
      },
      // body: {
      //   id: request.id,
      // },
    });
  },
  getPathCollection(request: GetPathCollectionRequest) {
    return $fetch('/api/v1/web_portal/project/collection/get-path-collection', {
      params: {
        project_id: request.project_id,
        collection: request.collection,
      },
    });
  },
  readCollection(request: ReadCollectionRequest) {
    return $fetch('/api/v1/web_portal/project/collection/read', {
      params: {
        project_id: request.project_id,
        collection: request.collection,
        sub_path: request.sub_path,
      },
    });
  },
  getProjectComponentConfig(request: GetProjectComponentConfigRequest) {
    return $fetch('/api/v1/web_portal/project/project-component', {
      params: {
        project_id: request.project_id,
        sub_path: request.sub_path,
      },
    });
  },
  getPublicAsset(request: GetPublicAssetRequest) {
    return $fetch('/api/v1/web_portal/project/project-media/get-public-asset', {
      params: {
        project_id: request.project_id,
        path: request.path,
      },
    });
  },
  uploadAsset(request: UploadAssetRequest) {
    return new Promise(async (resolve, reject) => {
      try {
        const res: any = await $fetch('/api/v1/web_portal/project/project-media/upload', {
          params: {
            project_id: request.project_id,
            path: request.path,
          },
        });
        const { pre_signed_url, url } = res.data;
        await $fetch(pre_signed_url, {
          method: 'PUT',
          body: request.file,
          onRequest({ options }) {
            delete (options?.headers as any)?.Authorization;
          },
        });
        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
  },
  readLogRealTime(request: ReadLogRealtimeRequest) {
    return $fetch('/api/v1/web_portal/project/project-log/show', {
      params: {
        id: request.id,
        project_id: request.project_id,
        is_pending: request.is_pending,
      },
    });
  },
  editPage(request: EditPageRequest) {
    return $fetch('/api/v1/web_portal/project/collection/edit', {
      method: 'POST',
      body: objectToFormData(request),
    });
  },
  getActivities(request: GetActivitiesRequest) {
    return $fetch('/api/v1/web_portal/project/project-activity', {
      params: {
        ...request,
      },
    });
  },
  getActivity(request: GetActivityRequest) {
    return $fetch('/api/v1/web_portal/project/project-activity/view', {
      params: {
        id: request.id,
      },
    });
  },
  getActivityDiff(request: GetActivityDiffRequest) {
    return $fetch('/api/v1/web_portal/project/project-activity/diff', {
      params: {
        id: request.id,
      },
    });
  },
  getProjectThumbnail(request: GetProjectThumbnailRequest) {
    const runtimeConfig = useRuntimeConfig();
    return `${runtimeConfig.public.backendURL}/api/v1/web_portal/project/site/get-thumbnail?project_code=${
      request.code
    }&log_id_last=${
      request.logIdLast
    }&width=${request.width || 1920}&height=${request.height || 2000}`;
  },
  register(request: RegisterRequest) {
    return $fetch('/api/v1/web_portal/user/form/register', {
      method: 'POST',
      body: {
        email: request.email,
        username: request.username,
        password: request.password,
        firstname: request.firstname,
        lastname: request.lastname,
      },
    });
  },
  logout() {
    return $fetch('/api/v1/web_portal/user/form/logout', {
      method: 'POST'
    });
  },
};
