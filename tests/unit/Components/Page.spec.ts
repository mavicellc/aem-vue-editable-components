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

import { ComponentMapping, withComponentMappingContext } from '../../../src/ComponentMapping';
import { withEditable } from '../../../src/components/EditableComponent';
import { Page, PagePropertiesMixin} from '../../../src/components/Page';
import { withEditorContext } from '../../../src/EditorContext';
import 'reflect-metadata'
import {Component, Prop, Mixins, Vue} from 'vue-property-decorator'
import { mount } from "@vue/test-utils";


describe('Page ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const PAGE_PATH = '/page';
    const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/page/jcr:content/component1"]';
    const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/page/jcr:content/component2"]';
    const CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="child/page1"]';
    const CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="child/page2"]';
    const COMPONENT_TYPE1 = 'components/c1';
    const COMPONENT_TYPE2 = 'components/c2';
    const PAGE_TYPE1 = 'components/p1';
    const PAGE_TYPE2 = 'components/p2';

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

    interface PageModel {
        ':type': string;
        'id': string;
        ':path': string;
        cqChildren: {};
        cqItems: {};
        cqItemsOrder: [];
        cqPath: '';
        isInEditor: boolean;
    }

    const CHILDREN: { [key: string]: PageModel } = {
        'page1': {
            cqChildren: {},
            cqItems: {},
            cqItemsOrder: [],
            cqPath: '',
            isInEditor: false,
            ':type': PAGE_TYPE1,
            'id': 'p1',
            ':path': 'child/page1'
        },
        'page2': {
            cqChildren: {},
            cqItems: {},
            cqItemsOrder: [],
            cqPath: '',
            isInEditor: false,
            ':type': PAGE_TYPE2,
            'id': 'p2',
            ':path': 'child/page2'
        }
    };

    let rootNode: any;
    let EditorContextPage: any;
    let ComponentMappingSpy: any;

    @Component
    class DummyProps extends Vue{
        @Prop() id!: string;
        @Prop({ default: false }) cqForceReload?: boolean;
        @Prop({ default: false }) isInEditor!: boolean;
        @Prop({ default: '' }) cqPath!: string;
    }

    @Component
    class ChildComponent extends Mixins(DummyProps) {
        render(createElement: Function) {
            return createElement('div', {
                attrs: {
                    id: this.id,
                    class: CHILD_COMPONENT_CLASS_NAME
                }
            })
        }
    }

    beforeEach(() => {
        ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
        EditorContextPage = withComponentMappingContext(withEditorContext(Page));
        EditorContextPage.test = true;
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

    describe('child pages ->', () => {
        it('should add the expected children', () => {
            ComponentMappingSpy.mockReturnValue(ChildComponent);

            const vm = mount(Page, {
                attachTo: rootNode,
                propsData: {
                    componentMapping: ComponentMapping,
                    cqPath: PAGE_PATH,
                    cqItems: ITEMS,
                    cqItemsOrder: ITEMS_ORDER,
                    isInEditor: false,
                    cqChildren: CHILDREN
                }
            });

            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const childItem1 = vm.find('#c1');
            const childItem2 = vm.find('#c2');

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();

            const childPage1 = vm.find('#p1');
            const childPage2 = vm.find('#p2');

            expect(childPage1).toBeDefined();
            expect(childPage2).toBeDefined();
        });

        //TODO Add EditorContext Test
    });
});