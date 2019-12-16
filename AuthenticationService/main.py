#!/usr/bin/env python3

from app import app

if __name__ == '__main__':
    # app.run(host='127.0.0.1', port=5000, debug=False, threaded=True)
    # app.run(debug=True, host='0.0.0.0')
    app.run(debug=False, host='0.0.0.0', threaded=True)
