import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import DefaultContainer from './containers/DefaultContainer';
import * as strings from 'JustAnotherGalleryWebPartStrings';
import {IJustAnotherGalleryWebPartProps} from'./IJustAnotherGalleryWebPartProps';
import { createStore, IState } from './store';
import { applyProperties, updateProperty } from './reducers/webpart';

export default class JustAnotherGalleryWebPart extends BaseClientSideWebPart<IJustAnotherGalleryWebPartProps> {
  private store: Store<IState>;

  public constructor(context: IWebPartContext) {
    super();
    this.store = createStore();
  }

  public render(): void {
    if (this.renderedOnce) { return; }

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
    this.store.dispatch(applyProperties(this.properties));

    return super.onInit();
  }

  protected onPropertyPaneFieldChanged(propertyPath, oldValue, newValue) {
    console.log('onPropertyChanged');
    if (!this.disableReactivePropertyChanges) {
      this.store.dispatch(updateProperty(propertyPath, newValue));
    }
  }

  protected get disableReactivePropertyChanges() {
    console.log('test:disableReactivePropertyChanges');
    return false;
  }

  protected onAfterPropertyPaneChangesApplied() {
    console.log('onAfterPropertyPaneChangesApplied');
    this.store.dispatch(applyProperties(this.properties));
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
