import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Environment, EnvironmentType, Version} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneDropdown, IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import {Store} from 'redux';
import {Provider} from 'react-redux';
import DefaultContainer from './containers/DefaultContainer';
import * as strings from 'JustAnotherGalleryWebPartStrings';
import {IJustAnotherGalleryWebPartProps} from'./IJustAnotherGalleryWebPartProps';
import {createStore, IState} from './store';
import {applyPictures} from "./actions/pictureAction";
import ListService from "./services/ListService";
import { PropertyPaneAsyncDropdown } from './controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { update, get } from '@microsoft/sp-lodash-subset';
import {ISPList} from "./interfaces/ISPList";
import {ISPFolder} from "./interfaces/ISPFolder";
import ImageService from "./services/ImageService";

export default class JustAnotherGalleryWebPart extends BaseClientSideWebPart<IJustAnotherGalleryWebPartProps> {
  private store: Store<IState>;
  private foldersDropdown;
  private listsDropdown;

  public constructor() {
    super();
    this.store = createStore();
  }

  public render(): void {
    if (this.renderedOnce) {
      return;
    }
    //this.store.dispatch(updateSelectedList({Title: 'test', Id: '12-ay'}));// todo remove after test

    const element = (
      <Provider store={this.store}>
        <DefaultContainer />
      </Provider>
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onInit() {
    return this.loadData();
  }

  protected loadData(): Promise<any> {
    if(this.properties.listId) {
      return ListService.getList(this.properties.listId, Environment.type, this.context).then(spList => {
        if(this.properties.folderPath) {
          ListService.getFolder(spList, this.properties.folderPath, Environment.type, this.context).then(spFolder => {
            return this.loadImages(spList, spFolder);
          })
        }
        else {
          return this.loadImages(spList, null);
        }
      })
    }
    else {
      return Promise.resolve({});
    }
  }

  protected loadImages(spList: ISPList, spFolder: ISPFolder): Promise<any>
  {
    return ImageService.get(spList, spFolder, Environment.type, this.context).then(images => {
      this.store.dispatch(applyPictures(images));
      return Promise.resolve({});
    });
  }


  protected onPropertyPaneAsyncFieldChanged(propertyPath, newValue) {
    if (!this.disableReactivePropertyChanges) {
      update(this.properties, propertyPath, (): any => { return newValue; });
      this.render();

      if(propertyPath == 'listId') {
        this.foldersDropdown.render();
      }

      this.loadData();
    }
  }

  protected get disableReactivePropertyChanges() {
    return false;
  }

  private loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    return ListService.get(Environment.type, this.context)
      .then(lists => lists.map(spList => {
        return {key: spList.Id, text: spList.Title}
      }));
  }

  private loadFolders(): Promise<IPropertyPaneDropdownOption[]> {
    if(this.properties.listId) {

      return ListService.getList(this.properties.listId, Environment.type, this.context).then(spList => {
        return ListService.getFolders(spList.Title, Environment.type, this.context)
          .then(folders => {
            const res = folders.map(spFolder => {
              return {key: spFolder.UniqueId, text: spFolder.Name}
            });
            res.splice(0, 0, {key: '', text:  strings.AllFolders});
            return res;
          });
      })
    }
    else {
      return Promise.resolve([]);
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    this.foldersDropdown = new PropertyPaneAsyncDropdown('folderPath', {
      label: strings.FolderFieldLabel,
      loadOptions: this.loadFolders.bind(this),
      selectedKey: this.properties.folderPath,
      onPropertyChange: this.onPropertyPaneAsyncFieldChanged.bind(this)
    });

    this.listsDropdown = new PropertyPaneAsyncDropdown('listId', {
      label: strings.PictureLibraryFieldLabel,
      loadOptions: this.loadLists.bind(this),
      selectedKey: this.properties.listId,
      onPropertyChange: this.onPropertyPaneAsyncFieldChanged.bind(this)
    });

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                this.listsDropdown,
                this.foldersDropdown
              ]
            }
          ]
        }
      ]
    };
  }
}
