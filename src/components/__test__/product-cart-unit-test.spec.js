import { describe, it, expect } from 'vitest'; // Import the describe, it, and expect functions from Vitest
import { mount } from '@vue/test-utils'; // Import the mount function from Vue Test Utils
import ProductCard from '../ProductCard.vue'; // Import the component to be tested

// Describe the test suite for the ProductCard component
describe('ProductCard.vue', () => {
  it('renders product information correctly', () => {
    const product = {
      id: 1,
      image: 'https://example.com/product.jpg',
      name: 'Test Product',
      description: 'Test description.',
      price: '$9.99',
    }; // Define a product object to be used in the test, this product is only for the test and not a real product
    const wrapper = mount(ProductCard, { props: { product } });

    const img = wrapper.find('img'); // Find the img element in the component
    expect(img.exists()).toBe(true); // Check if the img element exists
    expect(img.attributes('src')).toBe(product.image); // Check if the src attribute of the img element is equal to the product image
    expect(img.attributes('alt')).toBe(product.name); // Check if the alt attribute of the img element is equal to the product name

    // Find the h3 element in the component and check if it exists and has the correct text content
    const name = wrapper.find('h3');
    expect(name.exists()).toBe(true);
    expect(name.text()).toBe(product.name);

    // Find the p element with the class 'text-start' in the component and check if it exists and has the correct text content
    const description = wrapper.find('p.text-start');
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe(product.description);

    // Find the p element with the classes 'text-lg' and 'font-bold' in the component and check if it exists and has the correct text content
    const price = wrapper.find('p.text-lg.font-bold');
    expect(price.exists()).toBe(true);
    expect(price.text()).toBe(product.price);

    // Find the button element with the id 'read-more-btn' in the component and check if it exists and has the correct href attribute
    const readMoreBtn = wrapper.find('#read-more-btn');
    expect(readMoreBtn.exists()).toBe(true);
    expect(readMoreBtn.attributes('href')).toBe(`/product/${product.id}`);
  });
});