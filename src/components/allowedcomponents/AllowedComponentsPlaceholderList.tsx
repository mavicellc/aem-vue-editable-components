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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { PlaceHolderModel } from '../ContainerPlaceholder'
import { AllowedComponent } from './AllowedComponentsContainer'
import { AllowedComponentPlaceholder } from './AllowedComponentsPlaceholder'
import { CreateElement } from 'vue'

/**
 * @private
 */
const ALLOWED_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--list'
/**
 * @private
 */
const ALLOWED_COMPONENT_TITLE_CLASS_NAMES = 'aem-AllowedComponent--title'

/**
 * @private
 */
export interface AllowedComponentPlaceholderListProperties {
  title: string;
  emptyLabel: string;
  components: AllowedComponent[];
  placeholderProps: PlaceHolderModel;
  cqPath: string;
}

/**
 * List of placeholder of the Allowed Component Container.
 *
 * @private
 */
@Component({
  components: {}
})
export class AllowedComponentPlaceholderList extends Vue {
  @Prop({ default: 'No allowed components' }) emptyLabel?: string;
  @Prop({ default: () => {} }) placeholderProps!: PlaceHolderModel
  @Prop({ default: () => [] }) components!: AllowedComponent[]
  @Prop({ default: '' }) title?: string;
  @Prop({ default: '' }) cqPath?: string;

  render (createElement: Function) {
    const { components, placeholderProps, title, emptyLabel } = this
    const listLabel = (components && (components.length > 0)) ? title : emptyLabel
    let className = ALLOWED_PLACEHOLDER_CLASS_NAMES

    if (placeholderProps && placeholderProps.placeholderClassNames) {
      className += ' ' + placeholderProps.placeholderClassNames
    }

    return <div class={className}>
    <div class={ALLOWED_COMPONENT_TITLE_CLASS_NAMES} data-text={listLabel}></div>
    {components.map((component) =>
        <AllowedComponentPlaceholder path={component.path} emptyLabel={component.title} />
    )}
    </div>
  }
}
