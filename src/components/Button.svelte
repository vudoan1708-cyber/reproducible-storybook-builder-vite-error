<script>
  import './button.css';
  import { createEventDispatcher } from 'svelte';
  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;

  /**
   * What background color to use
   */
  export let backgroundColor;
  /**
   * How large should the button be?
   */
  export let size = 'medium';
  /**
   * Button contents
   */
  export let label = '';

  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

  const style = backgroundColor ? `background-color: ${backgroundColor}` : '';

  const dispatch = createEventDispatcher();

  /**
   * Optional click handler
   */
  const onClick = async () => {
    const req = await fetch('/api', { method: 'GET' });
    const response = await req.json();
    dispatch('click', response);
  };
</script>

<button
  type="button"
  class={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
  {style}
  on:click={onClick}>
  {label}
</button>
