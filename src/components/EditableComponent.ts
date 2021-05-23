/*
 *  Copyright 2021 Mavice LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import 'reflect-metadata'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Constants } from '../Constants'
import Vue, { CreateElement, RenderContext, VueConstructor } from 'vue'
import {ComponentMapping} from "@adobe/aem-spa-component-mapping";

/**
 * Configuration object of the withEditable function.
 *
 * @property emptyLabel - Label to be displayed on the overlay when the component is empty
 * @property isEmpty - Callback function to determine if the component is empty
 * @property resourceType - AEM ResourceType to be added as an attribute on the editable component dom
 */
export interface EditConfig {
  emptyLabel?: string;
  isEmpty(props: any): boolean;
  resourceType?: string;
  isInEditor?: boolean;
  cqPath?: string;
  cqForceReload?: boolean;
}

@Component({
  components: {}
})
export class EditableComponentProperties extends Vue {
  @Prop() componentProperties!: any;
  @Prop() editConfig!: EditConfig;
  @Prop() wrappedComponent!: VueConstructor;
  @Prop() containerProps!: { [key: string]: string };
  @Prop({ default: false }) cqForceReload?: boolean;
  @Prop({ default: false }) isInEditor!: boolean;
  @Prop({ default: '' }) cqPath!: string;
  @Prop({}) componentMapping?: ComponentMapping;
}

/**
 * The EditableComponent provides components with editing capabilities.
 */
@Component({
  components: {}
})
export default class EditableComponent extends Mixins(EditableComponentProperties) {
  state = this.propsToState(this.$props)

  propsToState (props: any): any {
    // Keep private properties from being passed as state
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { wrappedComponent, containerProps, editConfig, ...state } = props

    return state
  }

  /**
   * Properties related to the editing of the component.
   */
  editProps() {
    const componentProperties = this.componentProperties

    if (componentProperties && !componentProperties.isInEditor) {
      return {}
    }

    return {
      attrs: {
        'data-cq-data-path': componentProperties.cqPath,
        'data-cq-resource-type': this.editConfig.resourceType ? this.editConfig.resourceType : ''
      }
    }
  }

  protected get emptyPlaceholderProps () {
    if (!this.useEmptyPlaceholder()) {
      return null
    }

    return {
      class: Constants._PLACEHOLDER_CLASS_NAMES,
      attrs: {
        'data-emptytext': this.editConfig.emptyLabel
      }
    }
  }

  /**
   * Should an empty placeholder be added.
   *
   * @return
   */
  public useEmptyPlaceholder () {
    return (
      this.componentProperties &&
      this.componentProperties.isInEditor &&
      typeof this.editConfig.isEmpty === 'function' &&
      this.editConfig.isEmpty(this.componentProperties)
    )
  }

  render (createElement: CreateElement) {
    return createElement('div', {
      ...this.editProps(),
      class: [(this.containerProps && this.containerProps.className ? this.containerProps.className : '')],
    }, [
      createElement(this.wrappedComponent, {
        props: {
          ...this.state,
          ...this.componentProperties
        },
        key: this.cqPath + '-editable-component'
      }),
      createElement('div', {
        ...this.emptyPlaceholderProps
      })
    ])
  }
}

/**
 * Returns a component wrapper that provides editing capabilities to the component.
 *
 * @param WrappedComponent
 * @param editConfig
 */
export function withEditable (
  WrappedComponent: VueConstructor,
  editConfig?: EditConfig
): VueConstructor {
  const defaultEditConfig = editConfig || { isEmpty: (props: any) => false }
  return Vue.extend({
    functional: true,
    name: 'EditableComponent',
    render (createElement: Function, context: RenderContext) {
      return createElement(EditableComponent, {
        attrs: {
          ...context.data.attrs
        },
        props: {
          ...context.props,
          componentProperties: context.props,
          editConfig: defaultEditConfig,
          wrappedComponent: WrappedComponent
        },
        key: context.props.cqPath + '-editable-component-wrapper'
      })
    }
  })
}
