from setuptools import setup

setup(
    name='ctdecide',
    version="0.1",
    author='Mario Balibrera',
    author_email='mario.balibrera@gmail.com',
    license='MIT License',
    description='Decision plugin for cantools (ct)',
    long_description='This package provides a framework for group decision making.',
    packages=[
        'ctdecide'
    ],
    zip_safe = False,
    install_requires = [
        "ct >= 0.8.5.1"
    ],
    entry_points = '''''',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)
