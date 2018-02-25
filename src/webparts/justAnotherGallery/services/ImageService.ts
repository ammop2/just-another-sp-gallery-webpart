import {ISPList} from '../interfaces/ISPList';
import {EnvironmentType} from '@microsoft/sp-core-library';
import {WebPartContext} from "@microsoft/sp-webpart-base";
import {SPHttpClient, SPHttpClientResponse} from "@microsoft/sp-http";
import {ISPFolder} from "../interfaces/ISPFolder";
import {ISPImage} from "../interfaces/ISPImage";
import {ISPImages} from "../interfaces/ISPImages";


export default class ImageService {

  public static get(spList: ISPList, spFolder: ISPFolder = null, environmentType: EnvironmentType, context: WebPartContext): Promise<ISPImage[]> {

    if (environmentType === EnvironmentType.Local) {
      const items: ISPImage[] = [
        {ImageHeight: 183, ImageWidth: 275, FileRef: '/lib/assets/cats/cat1.jpg'},
        {ImageHeight: 279, ImageWidth: 180, FileRef: '/lib/assets/cats/cat2.jpg'},
        {ImageHeight: 183, ImageWidth: 275, FileRef: '/lib/assets/cats/cat3.jpg'},
        {ImageHeight: 225, ImageWidth: 225, FileRef: '/lib/assets/dogs/dog1.jpg'},
        {ImageHeight: 183, ImageWidth: 275, FileRef: '/lib/assets/dogs/dog2.jpg'},
        {ImageHeight: 168, ImageWidth: 300, FileRef: '/lib/assets/dogs/dog3.jpg'},
      ];

      return new Promise<ISPImage[]>((resolve) => {
        if(spFolder) {
          resolve(items.filter(i => i.FileRef.indexOf(spFolder.UniqueId) > 0));
        }
        else {
          resolve(items);
        }
      });
    }
    else if (environmentType == EnvironmentType.SharePoint ||
      environmentType == EnvironmentType.ClassicSharePoint) {

      let url = `${context.pageContext.web.absoluteUrl}/_api/Web/Lists(guid'${spList.Id}')/items?$select=FileRef,ImageWidth,ImageHeight&$filter=ContentTypeId eq '0x01010200D0CF778C1538E542909C24F9A7F6BA0F'`;

      if (spFolder) {
        url += ` and startswith(FileRef,  '${context.pageContext.web.serverRelativeUrl}/${spList.Title}/${spFolder.Name}')`
      }

      console.log("url" + url);

      return context.spHttpClient.get(url, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json().then((spLists: ISPImages) => spLists.value);
        });
    }
  }
}
