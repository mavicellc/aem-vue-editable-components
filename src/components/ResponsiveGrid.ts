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

import { MapTo, withComponentMappingContext } from '../ComponentMapping'
import {
  AllowedComponentsContainer, AllowedComponentsPropertiesMixin
} from './allowedcomponents/AllowedComponentsContainer'
import { PlaceHolderModel } from './ContainerPlaceholder'
import { EditConfig } from './EditableComponent'
import { Constants } from '../Constants'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import Utils from '../Utils'

@Component({
  components: {}
})
export class ResponsiveGridPropertiesMixin extends Mixins(AllowedComponentsPropertiesMixin) {
  @Prop({ default: () => {} }) columnClassNames!: { [key: string]: string };
  @Prop({ default: '' }) gridClassNames?: string;
}

@Component({
  components: {}
})
export class ResponsiveGrid extends Mixins(ResponsiveGridPropertiesMixin, AllowedComponentsContainer) {
  _allowedComponentPlaceholderListEmptyLabel!: string;

  containerAttrs (): {} {
    return {
      class: Constants._CONTAINER_CLASS_NAMES + ' ' + this.gridClassNames,
      attrs: {
        'data-cq-data-path': this.isInEditor ? this.cqPath : ''
      }
    }
  }

  get placeholderProps (): PlaceHolderModel {
    return {
      placeholderClassNames: Constants.NEW_SECTION_CLASS_NAMES + ' ' + Constants._RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES,
      cqPath: this.cqPath
    }
  }

  getItemComponentProps (
    item: any,
    itemKey: string,
    itemPath: string
  ): { [key: string]: string } {
    const attrs = Utils.modelToProps(this.cqItems[itemKey])

    attrs.className = attrs.className || ''
    attrs.className +=
      this.columnClassNames && this.columnClassNames[itemKey]
        ? ' ' + this.columnClassNames[itemKey]
        : ''

    return attrs
  }
}

/**
 * @private
 */
const config: EditConfig = {
  isEmpty (props: any): boolean {
    return props.cqItemsOrder && props.cqItemsOrder.length > 0
  }
}

MapTo('wcm/foundation/components/responsivegrid')(
  withComponentMappingContext(ResponsiveGrid),
  config
)
