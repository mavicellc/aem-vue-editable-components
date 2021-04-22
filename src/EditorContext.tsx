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

import { Vue } from 'vue-property-decorator'
import { CreateElement, RenderContext } from 'vue'

const withEditorContext = (Component: any): any => {
  return Vue.extend({
    functional: true,
    render (createElement: CreateElement, context: RenderContext) {
      return createElement(Component, {
        attrs: {
          ...context.data.attrs
        },
        props: {
          ...context.props
        }
      })
    }
  })
}

export { withEditorContext }
