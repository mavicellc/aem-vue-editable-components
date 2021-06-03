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

/**
 * @private
 */
const ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--component cq-placeholder placeholder'

/**
 * @private
 */
export interface AllowedComponentPlaceHolderProperties {
  emptyLabel: string;
  path: string;
}

/**
 * Placeholder for one Allowed Component.
 * @private
 */
@Component({
  components: {}
})
export class AllowedComponentPlaceholder extends Vue {
  @Prop({ default: '' }) emptyLabel?: string;
  @Prop({ default: '' }) path?: string;

  static get propTypes () {
    return {
      emptyLabel: String,
      path: String
    }
  }

  public render (createElement: Function) {
    const { path, emptyLabel } = this

    return <div data-cq-data-path={path} data-emptytext={emptyLabel} class={ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES}></div>
  }
}
