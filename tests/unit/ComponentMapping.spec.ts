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
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { ComponentMapping, MapTo } from '../../src/ComponentMapping';
import { MappedComponentPropertiesMixin } from '../../src/components/Container';
import { EditConfig } from '../../src/components/EditableComponent';

describe('ComponentMapping', () => {

    @Component({})
    class PropsMixin extends Mixins(MappedComponentPropertiesMixin){
        @Prop() src!: string;
    }

    const COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';
    const editConfig: EditConfig = {
        emptyLabel: 'Image',

        isEmpty: function(props) {
            return !props || !props.src || (props.src.trim().length < 1);
        }
    };


    class TestComponent extends Mixins(PropsMixin) {
        render (createElement: Function) {
            return createElement('div')
        }
    }

    it('should store and retrieve component', () => {
        const spy = jest.spyOn(document.head, 'querySelector').mockReturnValue({ content: 'edit' } as any);

        MapTo(COMPONENT_RESOURCE_TYPE)(TestComponent, editConfig);

        const WrappedTestComponent = ComponentMapping.get(COMPONENT_RESOURCE_TYPE);

        expect(WrappedTestComponent).toBeDefined();
        spy.mockRestore();
    });
});