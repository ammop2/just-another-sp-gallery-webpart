import {ISPList} from '../interfaces/ISPList';
import {EnvironmentType} from '@microsoft/sp-core-library';
import {WebPartContext} from "@microsoft/sp-webpart-base";
import {SPHttpClient, SPHttpClientResponse} from "@microsoft/sp-http";
import {ISPLists} from "../interfaces/ISPLists";
import {ISPFolder} from "../interfaces/ISPFolder";
import {ISPFolders} from "../interfaces/ISPFolders";


export default class ListService {
  public static get(environmentType: EnvironmentType, context: WebPartContext): Promise<ISPList[]> {

    if (environmentType === EnvironmentType.Local) {
      const items: ISPList[] = [
        {Title: 'Mock List', Id: '1'},
        {Title: 'Mock List 2', Id: '2'},
        {Title: 'Mock List 3', Id: '3'}];

      return new Promise<ISPList[]>((resolve) => {
        resolve(items);
      });
    }
    else if (environmentType == EnvironmentType.SharePoint ||
      environmentType == EnvironmentType.ClassicSharePoint) {
      //: PictureLibrary => BaseTemplate 109
      return context.spHttpClient.get(context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false and BaseTemplate eq 109`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json().then((spLists: ISPLists) => spLists.value);
        });
    }
  }

  public static getFolder(spList: ISPList, uniqueId: string, environmentType: EnvironmentType, context: WebPartContext): Promise<ISPFolder> {
    if (environmentType === EnvironmentType.Local) {
      const items = [
        {Name: 'Cats', UniqueId: 'cats'},
        {Name: 'Dogs', UniqueId: 'dogs'}];

      return new Promise<ISPFolder>((resolve) => {
        resolve(items.filter(i => i.UniqueId == uniqueId)[0]);
      });
    }
    else if (environmentType == EnvironmentType.SharePoint ||
      environmentType == EnvironmentType.ClassicSharePoint) {

      return context.spHttpClient.get(context.pageContext.web.absoluteUrl + `/_api/web/GetFolderById('${uniqueId}')`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        });
    }
  }

  public static getFolders(listName: string, environmentType: EnvironmentType, context: WebPartContext): Promise<ISPFolder[]> {

    if (environmentType === EnvironmentType.Local) {
      const items: ISPFolder[] = [
        {Name: 'Cats', UniqueId: 'cats'},
        {Name: 'Dogs', UniqueId: 'dogs'}];

      return new Promise<ISPFolder[]>((resolve) => {
        resolve(items);
      });
    }
    else if (environmentType == EnvironmentType.SharePoint ||
      environmentType == EnvironmentType.ClassicSharePoint) {
      return context.spHttpClient.get(context.pageContext.web.absoluteUrl + `/_api/web/GetFolderByServerRelativeUrl('${context.pageContext.web.serverRelativeUrl}/${listName}')/Folders?$filter=Name ne 'Forms' and Exists eq true`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json().then((spFolders: ISPFolders) => spFolders.value);
        });
    }
  }

  public static getList(listId: string, environmentType: EnvironmentType, context: WebPartContext): Promise<ISPList> {

    if (environmentType === EnvironmentType.Local) {
      const items = [
        {Title: 'Mock List', Id: '1'},
        {Title: 'Mock List 2', Id: '2'},
        {Title: 'Mock List 3', Id: '3'}];

      return new Promise<ISPList>((resolve) => {
        resolve(items.filter(i => i.Id == listId)[0]);
      });
    }
    else if (environmentType == EnvironmentType.SharePoint ||
      environmentType == EnvironmentType.ClassicSharePoint) {

      return context.spHttpClient.get(context.pageContext.web.absoluteUrl + `/_api/web/lists('${listId}')`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => response.json());
    }
  }
}
