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

import { ComponentMapping } from '../../../src/ComponentMapping';
import { Container } from '../../../src/components/Container';
import { withEditable } from '../../../src/components/EditableComponent';
import 'reflect-metadata'
import { mount } from "@vue/test-utils";
import { Component, Prop, Mixins, Vue } from 'vue-property-decorator'
import {ResponsiveGrid} from "../../../src/components/ResponsiveGrid";

describe('Container ->', () => {
    const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
    const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/*"]';
    const ROOT_CLASS_NAME = 'root-class';
    const ITEM_CLASS_NAME = 'item-class';
    const CONTAINER_PATH = '/container';
    const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component1"]';
    const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component2"]';
    const COMPONENT_TYPE1 = 'components/c1';
    const COMPONENT_TYPE2 = 'components/c2';

    const ITEMS = {
        'component1': {
            ':type': COMPONENT_TYPE1,
            'id': 'c1'
        },
        'component2': {
            ':type': COMPONENT_TYPE2,
            'id': 'c2'
        }
    };

    const ITEMS_ORDER = [ 'component1', 'component2' ];

    @Component
    class DummyProps extends Vue{
        @Prop() id!: string;
        @Prop({ default: false }) cqForceReload?: boolean;
        @Prop({ default: false }) isInEditor!: boolean;
        @Prop({ default: '' }) cqPath!: string;
    }

    @Component
    class ComponentChild extends Mixins(DummyProps) {
        render(createElement: Function) {
            return createElement('div', {
                attrs: {
                    id: this.id,
                    class: ITEM_CLASS_NAME
                }
            })
        }
    }

    let rootNode: any;
    let ComponentMappingSpy: jest.SpyInstance;

    beforeEach(() => {
        ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        ComponentMappingSpy.mockRestore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('childComponents ->', () => {
        it('should add the expected components', () => {
            ComponentMappingSpy.mockReturnValue(ComponentChild);

            const vm = mount(Container, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    cqItems: ITEMS,
                    cqItemsOrder: ITEMS_ORDER,
                    cqPath: '',
                    isInEditor: false
                }
            });

            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const childItem1 = vm.find('#c1');
            const childItem2 = vm.find('#c2');

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();
        });

        it('should add a placeholder with data attribute when in WCM edit mode', () => {

            const vm = mount(Container, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    cqPath: '',
                    isInEditor: true
                }
            });

            const containerPlaceholder = vm.find(CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR + CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeDefined();
        });

        it('should not add a placeholder when not in WCM edit mode', () => {

            const vm = mount(Container, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    isInEditor: false
                }
            });

            const containerPlaceholder = vm.find(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder.exists()).toBe(false);
        });

        it('should add a data attribute on the children when in WCM edit mode', () => {
            ComponentMappingSpy.mockReturnValue(withEditable(ComponentChild));

            const vm = mount(Container, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    cqItems: ITEMS,
                    cqItemsOrder: ITEMS_ORDER,
                    cqPath: CONTAINER_PATH,
                    isInEditor: true
                }
            });

            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const containerPlaceholder = vm.find(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeDefined();

            const childItem1 = vm.find(ITEM1_DATA_ATTRIBUTE_SELECTOR);
            const childItem2 = vm.find(ITEM2_DATA_ATTRIBUTE_SELECTOR);

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();
        });
    });

    describe('Data attributes ->', () => {
        it('should not add a the cq-data-path attribute if not in WCM edit mode', () => {

            const vm = mount(Container, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    cqPath: CONTAINER_PATH,
                    isInEditor: false
                }
            });

            const container = vm.find('[data-cq-data-path="/container"]');

            expect(container.exists()).toBe(false);
        });

        it('should add a the cq-data-path attribute if in WCM edit mode', () => {

            const vm = mount(Container, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    cqPath: CONTAINER_PATH,
                    isInEditor: true
                }
            });

            const container = vm.find('[data-cq-data-path="/container"]');

            expect(container).toBeDefined();
        });
    });
});