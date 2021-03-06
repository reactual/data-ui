/* eslint-disable no-param-reassign */
export default function updateDisplayName(WrappedComponent, EnhancedComponent, hocName) {
  const wrappedComponentName = WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component';

  EnhancedComponent.WrappedComponent = WrappedComponent;
  EnhancedComponent.displayName = `${hocName}(${wrappedComponentName})`;
}
