import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '../ProductCard.vue';

describe('ProductCard.vue', () => {
  it('renders product name', () => {
    const product = { name: 'Test Product' };
    const wrapper = mount(ProductCard, { props: { product } });

    expect(wrapper.text()).toContain(product.name); // Check if component renders product name
  });
});