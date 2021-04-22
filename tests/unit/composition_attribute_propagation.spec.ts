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

import { withEditable } from '../../src/components/EditableComponent';
import { withEditorContext } from '../../src/EditorContext';
import { ModelManager } from '@adobe/aem-spa-page-model-manager';
import { withModel } from '../../src/components/ModelProvider';
import 'reflect-metadata'
import { mount } from "@vue/test-utils";
import { Component, Prop, Mixins, Vue } from 'vue-property-decorator'
import Utils from '../../src/Utils';

describe('Composition and attribute propagation ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const DATA_ATTR_TO_PROPS = 'attrtoprops';


    @Component
    class DummyProps extends Vue{
        @Prop({ default: COMPONENT_RESOURCE_TYPE }) cqType?: string;
        @Prop({ default: '' }) id!: string;
        @Prop({ default: COMPONENT_PATH }) cqPath?: string;
        @Prop({ default: false }) attrToProps!: string;
    }

    @Component
    class ChildComponent extends Mixins(DummyProps) {
        render(createElement: Function) {
            return createElement('div', {
                attrs: {
                    id: this.id,
                    class: CHILD_COMPONENT_CLASS_NAME,
                    'attrtoprops': this.attrToProps
                }
            });
        }
    }

    let rootNode: any;
    let isInEditorSpy: jest.SpyInstance;
    let addListenerSpy: jest.SpyInstance;
    let getDataSpy: jest.SpyInstance;

    beforeEach(() => {
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
        isInEditorSpy = jest.spyOn(Utils, 'isInEditor').mockReturnValue(false);
        addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
        getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
    });

    afterEach(() => {
        isInEditorSpy.mockRestore();
        addListenerSpy.mockRestore();
        getDataSpy.mockRestore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    /**
     * Sets a property on the provided CompositeComponent then updates it
     *
     * @param CompositeComponent
     */
    function testCompositionAttributePropagation(CompositeComponent: any) {

        const vm = mount(CompositeComponent, {
            attachTo: rootNode,
            propsData: {
                attrToProps: 'true'
            }
        });

        let node = vm.find('[' + DATA_ATTR_TO_PROPS + ']');

        expect(node).toBeDefined();
        expect(node.attributes()[DATA_ATTR_TO_PROPS]).toEqual('true');

        // Update the component with new properties
        const vm2 = mount(CompositeComponent, {
            attachTo: rootNode,
            propsData: {
                attrToProps: 'false'
            }
        });

        node = vm2.find('[' + DATA_ATTR_TO_PROPS + ']');
        expect(node).toBeDefined();
        expect(node.attributes()[DATA_ATTR_TO_PROPS]).toEqual('false');
    }

    describe('withEditable ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditable(ChildComponent));
        });
    });

    describe('withModel ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withModel(ChildComponent));
        });
    });

    describe('withEditorContext ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditorContext(ChildComponent));
        });
    });

    describe('withEditorContext + withModel + withEditable ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditorContext(withModel(withEditable(ChildComponent))));
        });
    });
});