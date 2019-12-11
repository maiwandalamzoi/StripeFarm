import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
/**
 * the configure function sets up the enzyme adapter to make testing easier.
 */
configure({ adapter: new Adapter() });
